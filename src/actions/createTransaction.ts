'use server'

import MedicalStudies from "@/database/models/MedicalStudies";
import { TRANSACTION_FIELDS } from "./constants";
import Transaction from "@/database/models/Transaction";
import { getDate } from "@/utils/date";
import { getForm } from "@/utils/form";

export async function createTransaction(operationId: string, formData: FormData) {
    'use server'
    const { code, price, quantity, copay, date } = getForm(TRANSACTION_FIELDS, formData)
    if(code && operationId) {
        const medicalStudy = await MedicalStudies.findOne({ code }).lean();
        if(medicalStudy) {
            const transaction = new Transaction({
                operation_id: operationId,
                medical_study_id: medicalStudy._id,
                price: parseFloat(price),
                quantity: parseInt(quantity),
                copay: copay ? parseFloat(copay) : 0,
                date: getDate(date)
            })
            await transaction.save()
            return {
                _id: transaction._id.toString(),
                operation_id: transaction.operation_id.toString(),
                medical_study_id: transaction.medical_study_id.toString(),
                price: transaction.price,
                quantity: transaction.quantity,
                copay: transaction.copay,
                date: transaction.date.toString()
            }
        }
    }
}