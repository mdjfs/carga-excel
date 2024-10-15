'use server'

import dbConnect from "@/database";
import Tramit from "@/database/models/Tramit";
import { GET_TRAMITS_TAG, TRAMIT_FIELDS } from "./constants";
import { revalidateTag } from "next/cache";
import { getForm } from "@/utils/form";


export async function createTramit(formData: FormData) {
    'use server'
    const { name, total } = getForm(TRAMIT_FIELDS, formData)
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

