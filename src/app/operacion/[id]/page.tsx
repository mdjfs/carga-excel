'use server'
/* eslint-disable @typescript-eslint/no-explicit-any */
import Card from "@/components/Card";
import dbConnect from "@/database";
import Affiliate from "@/database/models/Affiliate";
import Operation from "@/database/models/Operation";
import Tramit from "@/database/models/Tramit";
import { notFound } from "next/navigation";
import styles from "./operation.module.scss"
import { createTransaction } from "@/actions/createTransaction";
import { getMedicalStudies } from "@/actions/getMedicalStudies";
import { formatToARS } from "@/utils/money";
import { formatDateToDDMMYYYY } from "@/utils/date";
import Pill from "@/components/Pill";
import Button from "@/components/Button";
import DeleteButton from "@/components/DeleteButton";
import CreateData from "@/components/CreateData";
import { deleteOperation } from "@/actions/deleteOperation";
import { deleteTransaction } from "@/actions/deleteTransaction";
import { getTransactions } from "@/actions/getTransactions";

interface OperationProps {
    params: { id: string };
}


export default async function Home({ params }: OperationProps) {
    await dbConnect();
    const operation = await Operation.findById(params.id).lean();
    if(!operation) return notFound()

    const tramit = await Tramit.findById(operation.tramit_id).lean();
    const affiliate = await Affiliate.findById(operation.affiliate_id).lean();
    const { transactions } = await getTransactions(operation._id.toString());
    const { medicalStudies } = await getMedicalStudies();

    const createTransactionWithOperationId = createTransaction.bind(null, operation._id);
    const deleteOperationWithId = deleteOperation.bind(null, operation._id);
    

    return (
        <div style={{maxWidth: 1200, margin: 'auto', position: 'relative'}}>
            <div className={styles.headerContainer}>
                <div style={{ display: 'inline-flex', gap: 10 }}>
                    <Button label="Volver" secondary href={`/tramite/${operation.tramit_id}`}/>
                    {!tramit?.complete && <CreateData type="transaction" action={createTransactionWithOperationId} />}
                    {!tramit?.complete && <DeleteButton action={deleteOperationWithId} href={`/tramite/${tramit?._id}`} />}
                </div>
                <div className={styles.totalContainer}>
                    <div className={styles.tramitTotal}>Total <b>{formatToARS(operation.total)}</b> </div>
                </div>
            </div>
            <p><b>Operación del trámite {tramit?.name} para el afiliado {affiliate?.name}</b></p>
            {transactions.length === 0 && <p>No hay estudios creados todavía.</p>}
            {transactions.map(transaction => {
                const study = medicalStudies.find(study => study._id === transaction.medical_study_id.toString());
                return <Card 
                    key={transaction._id.toString()} 
                    title={`${formatDateToDDMMYYYY(transaction.date)} - ${study?.name}`}
                    footer={<div style={{display: 'inline-flex', gap: 5, alignItems: 'center'}}>
                        {!tramit?.complete && <DeleteButton small action={deleteTransaction.bind(null, transaction._id)} />}
                        {transaction.copay ? <Pill label={`COPAGO ${formatToARS(transaction.copay)}`} /> : <></>}
                        <Pill label={transaction.quantity.toString()} />
                        <Pill status="success" label={formatToARS((transaction.price * transaction.quantity) - transaction.copay)} />
                    </div>}
                    href={tramit?.complete ? '#' : `/transaccion/${transaction._id}`} 
                />
            })}
        </div>
    )

}
