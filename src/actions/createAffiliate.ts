'use server'

import dbConnect from "@/database";
import Affiliate from "@/database/models/Affiliate";
import { AFFILIATE_FIELDS, GET_AFFILIATES_TAG } from "./constants";
import { revalidateTag } from "next/cache";
import { getForm } from "@/utils/form";

export async function createAffiliate(formData: FormData) { 
    'use server'
    const { name, identifier } = getForm(AFFILIATE_FIELDS, formData)
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
