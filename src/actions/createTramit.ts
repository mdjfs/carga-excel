'use server'

import dbConnect from "@/database";
import Tramit from "@/database/models/Tramit";
import { GET_TRAMITS_TAG, TRAMIT_FIELDS } from "./constants";
import { revalidateTag } from "next/cache";


export async function createTramit(formData: FormData) {
    'use server'
    const name = formData.get(TRAMIT_FIELDS.name) as string
    const total = formData.get(TRAMIT_FIELDS.total) as string
    if (name && total) {
        await dbConnect();
        const tramit = new Tramit({ name, total: parseFloat(total) });
        await tramit.save();
        revalidateTag(GET_TRAMITS_TAG);
        return {
            _id: tramit._id.toString(),
            name: tramit.name,
            total: tramit.total 
        }
    }
}

