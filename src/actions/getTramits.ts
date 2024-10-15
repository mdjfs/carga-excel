/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import dbConnect from "@/database";
import Tramit from "@/database/models/Tramit";
import { GET_TRAMITS_TAG } from "./constants";

export async function getTramits(complete?: string) {
    'use server'
    await dbConnect();
    const filter = {} as any
    if (complete !== undefined) filter.complete = complete;
    const tramits = await Tramit.find(filter).sort({ _id: -1 }).lean();

    return { tramits: tramits.map(tramit => ({
        _id: tramit._id.toString(),
        name: tramit.name,
        total: tramit.total,
        complete: tramit.complete
    })), tag: GET_TRAMITS_TAG };
}