'use server';

import dbConnect from "@/database";
import { GET_AFFILIATES_TAG } from "./constants";
import Affiliate from "@/database/models/Affiliate";

export async function getAffiliates() {
    'use server'
    await dbConnect();
    const affiliates = await Affiliate.find({}).lean();

    return { affiliates: affiliates.map(affiliate => ({
        _id: affiliate._id.toString(),
        name: affiliate.name,
        identifier: affiliate.identifier
    })), tag: GET_AFFILIATES_TAG };
}