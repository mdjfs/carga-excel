'use server'

import dbConnect from "@/database";
import { GROUP_FIELDS } from "./constants";
import Group from "@/database/models/Group";
import MedicalStudies from "@/database/models/MedicalStudies";
import { getForm } from "@/utils/form";

export async function createGroup(tramitId: string, formData: FormData) {
    'use server'
    const { name, quantity, total, code } = getForm(GROUP_FIELDS, formData);
    await dbConnect();
    const medicalStudy = await MedicalStudies.findOne({ code }).lean();
    if(medicalStudy) {
        const group = await Group.create({
            name,
            quantity,
            total,
            medical_study_id: medicalStudy._id,
            tramit_id: tramitId
        })
        await group.save();
        return {
            _id: group._id.toString(),
            name: group.name,
            quantity: group.quantity,
            total: group.total,
            medical_study_id: group.medical_study_id.toString()
        }
    }

}