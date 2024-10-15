'use server'

import dbConnect from "@/database";
import { OPERATION_FIELDS } from "./constants";
import Affiliate from "@/database/models/Affiliate";
import Operation from "@/database/models/Operation";
import { getForm } from "@/utils/form";

export async function createOperation(tramitId: string, formData: FormData) {
    'use server'
    const { identifier } = getForm(OPERATION_FIELDS, formData)
    if (identifier) {
        await dbConnect();
        const affiliate = await Affiliate.findOne({ identifier }).lean();
        if(affiliate) {
            const operation = new Operation({
                affiliate_id: affiliate._id,
                tramit_id: tramitId,
                total: 0
            })
            await operation.save()
            return {
                _id: operation._id.toString(),
                affiliate_id: operation.affiliate_id.toString(),
                tramit_id: operation.tramit_id.toString(),
                total: operation.total
            }
        }
    }
}