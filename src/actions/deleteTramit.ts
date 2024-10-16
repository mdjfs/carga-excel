'use server'

import dbConnect from "@/database";
import Tramit from "@/database/models/Tramit";
import { GET_TRAMITS_TAG } from "./constants";
import { revalidateTag } from "next/cache";


export async function deleteTramit(tramit_id: string) {
    'use server'
    await dbConnect();
    await Tramit.findOneAndDelete({ _id: tramit_id });
    revalidateTag(GET_TRAMITS_TAG);
}

