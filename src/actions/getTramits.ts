'use server';

import dbConnect from "@/database";
import Tramit from "@/database/models/Tramit";
import { GET_TRAMITS_TAG } from "./constants";

export async function getTramits(complete?: string) {
    'use server'
    await dbConnect();
    const tramits = complete === undefined ? await Tramit.find({}).lean() : await Tramit.find({ complete }).lean();

    return { tramits: tramits.map(tramit => ({
        _id: tramit._id.toString(),
        name: tramit.name,
        total: tramit.total,
        complete: tramit.complete
    })), tag: GET_TRAMITS_TAG };
}