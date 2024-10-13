'use server'

import dbConnect from "@/database";
import Affiliate from "@/database/models/Affiliate";
import { AFFILIATE_FIELDS, GET_AFFILIATES_TAG } from "./constants";
import { revalidateTag } from "next/cache";

export async function createAffiliate(formData: FormData) { 
    'use server'
    const name = formData.get(AFFILIATE_FIELDS.name) as string
    const identifier = formData.get(AFFILIATE_FIELDS.identifier) as string
    if (name && identifier) {
        await dbConnect();
        const affiliate = new Affiliate({ name, identifier });
        await affiliate.save()
        revalidateTag(GET_AFFILIATES_TAG)
        return {
            _id: affiliate._id.toString(),
            name: affiliate.name,
            identifier: affiliate.identifier
        }
    }
}
