'use server';

import dbConnect from "@/database";
import { GET_MEDICAL_STUDIES_TAG } from "./constants";
import MedicalStudies from "@/database/models/MedicalStudies";

export async function getMedicalStudies() {
    'use server'
    await dbConnect();
    const medicalStudies = await MedicalStudies.find({}).lean();

    return { medicalStudies: medicalStudies.map(medicalStudy => ({
        _id: medicalStudy._id.toString(),
        name: medicalStudy.name,
        code: medicalStudy.code
    })), tag: GET_MEDICAL_STUDIES_TAG };
}