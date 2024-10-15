import dbConnect from "@/database";
import { GET_MEDICAL_STUDIES_TAG, MEDICAL_STUDY_FIELDS } from "./constants";
import MedicalStudies from "@/database/models/MedicalStudies";
import { revalidateTag } from "next/cache";
import { getForm } from "@/utils/form";

export async function createMedicalStudy(formData: FormData) { 
    'use server'
    const { name, code } = getForm(MEDICAL_STUDY_FIELDS, formData)
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