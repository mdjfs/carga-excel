'use server'
/* eslint-disable @typescript-eslint/no-explicit-any */
import {  MEDICAL_STUDY_FIELDS, TRANSACTION_FIELDS } from "@/actions/constants";
import { createMedicalStudy } from "@/actions/createMedicalStudy";
import { getMedicalStudies } from "@/actions/getMedicalStudies";
import Button from "@/components/Button";
import CreateSelect from "@/components/CreateSelect";
import DeleteButton from "@/components/DeleteButton";
import Input from "@/components/Input";
import Modal from "@/components/Modal";
import dbConnect from "@/database";
import MedicalStudies from "@/database/models/MedicalStudies";
import Operation from "@/database/models/Operation";
import Transaction from "@/database/models/Transaction";
import { formatDateToDDMMYYYY, getDate } from "@/utils/date";
import { getForm } from "@/utils/form";
import { notFound, redirect } from "next/navigation";

interface TransactionProps {
    params: { id: string };
}

export default async function Home({ params }: TransactionProps) {
    await dbConnect();
    const transaction = await Transaction.findById(params.id).lean();
    if(!transaction) return notFound()
    const operation = await Operation.findById(transaction.operation_id).lean();

    async function handleSubmit(formData: FormData) {
        'use server'
        const { code, price, quantity, copay, date } = getForm(TRANSACTION_FIELDS, formData)
        if(code) {
            const medicalStudy = await MedicalStudies.findOne({ code }).lean();
            if(medicalStudy && operation) {
                await Transaction.findOneAndUpdate({ _id: params.id }, {
                    operation_id: operation._id,
                    medical_study_id: medicalStudy._id,
                    price: parseFloat(price),
                    quantity: parseInt(quantity),
                    copay: copay ? parseFloat(copay) : 0,
                    date: getDate(date)
                })
                redirect(`/operacion/${operation._id}`)
            }
        }
    }

    const { medicalStudies } = await getMedicalStudies()

    const selectedStudy = await MedicalStudies.findById(transaction.medical_study_id).lean();

    return (<form action={handleSubmit}>
        <Modal portal={false}>
            <p>Ingrese el código del estudio médico o el nombre del mismo</p>
            <CreateSelect selected={selectedStudy} required validator={{ type: 'code', message: 'El código del estudio tiene que tener 6 digitos' }} placeholder="Ingrese el código del estudio médico o el nombre del mismo" createAction={createMedicalStudy} searchKeys={[MEDICAL_STUDY_FIELDS.name, MEDICAL_STUDY_FIELDS.code]} name="Estudio" data={medicalStudies} keyValue={MEDICAL_STUDY_FIELDS.code} keyText={MEDICAL_STUDY_FIELDS.name}>
                <p>Nombre del Estudio Médico</p>
                <Input name={MEDICAL_STUDY_FIELDS.name} placeholder="Nombre del Estudio Médico" />
                <p>Código del Estudio Médico</p>
                <Input name={MEDICAL_STUDY_FIELDS.code} placeholder="Código del Estudio Médico" />
            </CreateSelect>
            <p>Fecha</p>
            <Input name={TRANSACTION_FIELDS.date} value={formatDateToDDMMYYYY(transaction.date)} placeholder="Fecha" formatter="date" required validator={{ type: 'date', message: 'Ingresa una fecha válida en formato dd/mm/yyyy'}} />
            <p>Precio</p>
            <Input name={TRANSACTION_FIELDS.price} value={transaction.price.toString()} placeholder="Precio" type="number" required />
            <p>Cantidad</p>
            <Input name={TRANSACTION_FIELDS.quantity} value={transaction.quantity.toString()} placeholder="Cantidad" type="number" formatter='integer' required />
            <p>Coseguro</p>
            <Input name={TRANSACTION_FIELDS.copay} value={transaction.copay.toString()} placeholder="Coseguro" type="number" />
            <div style={{display: 'flex', gap: 10, marginTop: 30}}>
                <Button secondary={true} label="Cancelar" href={`/operacion/${operation?._id}`} /> 
                <Button label="Continuar" type="submit" />
            </div>
            <div>
                <DeleteButton api={`api/transaction?id=${transaction._id}`} href={`/operacion/${operation?._id}`} name="transacción" />
            </div>
        </Modal>
    </form>)

}
