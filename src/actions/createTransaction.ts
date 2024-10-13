'use server'

import MedicalStudies from "@/database/models/MedicalStudies";
import { TRANSACTION_FIELDS } from "./constants";
import Transaction from "@/database/models/Transaction";

export async function createTransaction(operationId: string, formData: FormData) {
    'use server'
    const code = formData.get(TRANSACTION_FIELDS.code) as string
    const price = formData.get(TRANSACTION_FIELDS.price) as string
    const quantity = formData.get(TRANSACTION_FIELDS.quantity) as string
    const copay = formData.get(TRANSACTION_FIELDS.copay) as string
    const date = formData.get(TRANSACTION_FIELDS.date) as string
    if(code && operationId) {
        const medicalStudy = await MedicalStudies.findOne({ code }).lean();
        if(medicalStudy) {
            const [day, month, year] = date.split('/');
            const dateObj = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
            if (isNaN(dateObj.getTime())) {
                throw new Error("Fecha inválida");
            }
            const transaction = new Transaction({
                operation_id: operationId,
                medical_study_id: medicalStudy._id,
                price: parseFloat(price),
                quantity: parseInt(quantity),
                copay: copay ? parseFloat(copay) : 0,
                date: dateObj
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