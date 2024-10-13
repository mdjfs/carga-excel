import dbConnect from "@/database";
import { GET_MEDICAL_STUDIES_TAG, MEDICAL_STUDY_FIELDS } from "./constants";
import MedicalStudies from "@/database/models/MedicalStudies";
import { revalidateTag } from "next/cache";

export async function createMedicalStudy(formData: FormData) { 
    'use server'
    const name = formData.get(MEDICAL_STUDY_FIELDS.name) as string
    const code = formData.get(MEDICAL_STUDY_FIELDS.code) as string
    if (name && code) {
        await dbConnect();
        const medicalStudy = new MedicalStudies({ name, code });
        await medicalStudy.save()
        revalidateTag(GET_MEDICAL_STUDIES_TAG);
        return {
            _id: medicalStudy._id.toString(),
            name: medicalStudy.name,
            code: medicalStudy.code
        }
    }
}