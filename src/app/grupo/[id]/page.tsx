'use server'
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AFFILIATE_FIELDS, GROUP_OPERATION_FIELDS } from "@/actions/constants";
import CreateSelect from "@/components/CreateSelect";
import Input from "@/components/Input";
import Modal from "@/components/Modal";
import dbConnect from "@/database";
import Operation from "@/database/models/Operation";
import Group from "@/database/models/Group";
import { formatDateToDDMMYYYY, getDate } from "@/utils/date";
import { notFound, redirect } from "next/navigation";
import { createAffiliate } from "@/actions/createAffiliate";
import Affiliate from "@/database/models/Affiliate";
import Transaction from "@/database/models/Transaction";
import Button from "@/components/Button";

interface TransactionProps {
    params: { id: string };
}

export default async function Home({ params }: TransactionProps) {
    await dbConnect();
    const group = await Group.findById(params.id).lean();
    if(!group) return notFound()
    const operations = await Operation.find({ group_id: group._id }).lean()
    const editMode = operations.length === group.quantity;
    const affiliates = await Affiliate.find({}).lean();

    async function handleSubmit(formData: FormData) {
        'use server'
        if(group) {
            for(let i = 0; i < group.quantity; i++) {
                const date = formData.get(`${GROUP_OPERATION_FIELDS.date}-${i}`) as string
                const identifier = formData.get(`${GROUP_OPERATION_FIELDS.identifier}-${i}`) as string
                const dateObj = getDate(date);
                if(!editMode) {
                    const affiliate = await Affiliate.findOne({ identifier }).lean();
                    if(affiliate) {
                        const operation = await Operation.create({
                            affiliate_id: affiliate._id,
                            tramit_id: group.tramit_id,
                            group_id: group._id,
                            total: group.total
                        })
                        await Transaction.create({
                            operation_id: operation._id,
                            medical_study_id: group.medical_study_id,
                            price: parseFloat((group.total / group.quantity).toFixed(4)),
                            quantity: 1,
                            copay: 0,
                            date: dateObj
                        })
                    }
                } else {
                    const affiliate = await Affiliate.findOne({ identifier }).lean();
                    if(affiliate) {
                        const operation = operations[i];
                        if(operation.affiliate_id.toString() !== affiliate._id.toString()) {
                            await Operation.findOneAndUpdate({ _id: operation._id }, {
                                affiliate_id: affiliate._id,
                            })
                        }
                        const transaction = await Transaction.findOne({ operation_id: operation._id }).lean();
                        if(transaction && transaction.date.getTime() !== dateObj.getTime()) {
                            await Transaction.findOneAndUpdate({ _id: transaction._id }, {
                                date: dateObj
                            })
                        }
                    }
                }
            }
            redirect(`/tramite/${group.tramit_id}`)
        }
    }

    return (<form action={handleSubmit}>
        <Modal portal={false}>
            {!editMode && new Array(group.quantity).fill(0).map((_, i) => <div key={`operation-${i}`} style={{marginTop: 10, marginBottom: 10}}>
                <p>Operación #{i + 1}</p>
                <p>Fecha</p>
                <Input name={`${GROUP_OPERATION_FIELDS.date}-${i}`} placeholder="Fecha" formatter="date" required validator={{ type: 'date', message: 'Ingresa una fecha válida en formato dd/mm/yyyy'}} />
                <p>Afiliado</p>
                <CreateSelect inputName={`${GROUP_OPERATION_FIELDS.identifier}-${i}`} required placeholder="Ingresa el numero o el nombre del afiliado" createAction={createAffiliate} searchKeys={[AFFILIATE_FIELDS.name, AFFILIATE_FIELDS.identifier]} name="Afiliado" data={affiliates} keyValue={AFFILIATE_FIELDS.identifier} keyText={AFFILIATE_FIELDS.name}>
                    <p>Nombre del Afiliado</p>
                    <Input name={AFFILIATE_FIELDS.name} placeholder="Nombre del Afiliado" />
                    <p>Identificador del Afiliado</p>
                    <Input name={AFFILIATE_FIELDS.identifier} placeholder="Identificador del Afiliado" />
                </CreateSelect>
            </div>)}
            {editMode && operations.map(async (operation, i) => {
                const firstTransaction = await Transaction.findOne({ operation_id: operation._id }).lean();
                const affiliate = affiliates.find(affiliate => affiliate._id.toString() === operation.affiliate_id.toString());
                return firstTransaction && <div key={`operation-${i}`} style={{marginTop: 10, marginBottom: 10}}>
                    <p>Operación #{i + 1}</p>
                    <p>Fecha</p>
                    <Input name={`${GROUP_OPERATION_FIELDS.date}-${i}`} value={formatDateToDDMMYYYY(firstTransaction.date)} placeholder="Fecha" formatter="date" required validator={{ type: 'date', message: 'Ingresa una fecha válida en formato dd/mm/yyyy'}} />
                    <p>Afiliado</p>
                    <CreateSelect inputName={`${GROUP_OPERATION_FIELDS.identifier}-${i}`} selected={affiliate} required placeholder="Ingresa el numero o el nombre del afiliado" createAction={createAffiliate} searchKeys={[AFFILIATE_FIELDS.name, AFFILIATE_FIELDS.identifier]} name="Afiliado" data={affiliates} keyValue={AFFILIATE_FIELDS.identifier} keyText={AFFILIATE_FIELDS.name}>
                        <p>Nombre del Afiliado</p>
                        <Input name={AFFILIATE_FIELDS.name} placeholder="Nombre del Afiliado" />
                        <p>Identificador del Afiliado</p>
                        <Input name={AFFILIATE_FIELDS.identifier} placeholder="Identificador del Afiliado" />
                    </CreateSelect>
                </div>
            })}
            <div style={{display: 'flex', gap: 10, marginTop: 30}}>
                <Button secondary={true} label="Cancelar" href={`/tramite/${group.tramit_id}`} /> 
                <Button label="Continuar" type="submit" />
            </div>
        </Modal>
    </form>)

}
