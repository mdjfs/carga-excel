/* eslint-disable @typescript-eslint/no-explicit-any */
import { createOperation } from "@/actions/createOperation";
import { getAffiliates } from "@/actions/getAffiliates";
import Button from "@/components/Button";
import Card from "@/components/Card";
import dbConnect from "@/database";
import Tramit from "@/database/models/Tramit";
import { notFound } from "next/navigation";
import { formatToARS } from "@/utils/money"

import styles from "./tramit.module.scss"
import Pill from "@/components/Pill";
import DeleteButton from "@/components/DeleteButton";
import ExcelButton from "@/components/ExcelButton";
import { createGroup } from "@/actions/createGroup";
import CreateData from "@/components/CreateData";
import { getOperations } from "@/actions/getOperations";
import { sumAll } from "@/utils/sum";
import { deleteTramit } from "@/actions/deleteTramit";
import { deleteOperation } from "@/actions/deleteOperation";
import { deleteOperationGroup } from "@/actions/deleteOperationGroup";



interface TramitProps {
    params: { id: string };
}

export default async function Home({ params }: TramitProps) {
  await dbConnect();
  const tramit = await Tramit.findById(params.id).lean();
  if(!tramit) return notFound();
  const { groups } = await getOperations(tramit._id.toString());

  const createOperationWithTramitId = createOperation.bind(null, tramit._id);
  const createGroupWithTramitId = createGroup.bind(null, tramit._id);
  const deleteTramitWithId = deleteTramit.bind(null, tramit._id);

  const { affiliates } = await getAffiliates();

  const sumOperation = sumAll(groups, (group) => group.total);  
  const canSave = tramit.total - sumOperation === 0;

  return (
    <div style={{maxWidth: 1200, margin: 'auto', position: 'relative'}}>
       <div className={styles.headerContainer}>
         <div style={{ display: 'inline-flex', gap: 10 }}>
            <Button label="Volver" secondary href='/' />
            {!tramit.complete && <CreateData type="operation" action={createOperationWithTramitId} />}
            {!tramit.complete && <CreateData type="group" action={createGroupWithTramitId} />}
            {!tramit.complete && <DeleteButton action={deleteTramitWithId} href="/" />}
         </div>
          {canSave && <ExcelButton tramitId={tramit._id.toString()} />}
          {!canSave && <div className={styles.totalContainer}>
            <div className={styles.tramitTotal}>Total <b>{formatToARS(tramit.total)}</b> </div>
            <div  className={styles.tramitRemaining}>Restante <b>{formatToARS(tramit.total - sumOperation)}</b> </div>  
          </div>}
       </div>
       <div style={{fontSize: 18, paddingTop: 20, paddingBottom: 10}}><b>Trámite {tramit.name}</b></div>
       {groups.length === 0 && <p>No hay operaciones creadas todavía.</p>}
       {groups.map(group => {
          const renderOperations = (operation: any) => {
            const affiliate = affiliates.find(affiliate => affiliate._id === operation.affiliate_id?.toString());
            return <Card
              key={operation._id.toString()}
              title={`Afiliado ${affiliate?.name}`} 
              footer={<div style={{ display: 'inline-flex', gap: 5, alignItems: 'center' }}>
                {!tramit.complete && <DeleteButton small action={deleteOperation.bind(null, operation._id.toString())} />}
                <Pill label={formatToARS(operation.total)} status='success' />
              </div>}
              href={`/operacion/${operation._id.toString()}`}
            />
          }
          if(group.group_id) {
            return <Card
              key={group.group_id.toString()}
              title={`Grupo ${group.group_name}`}
              footer={<div style={{ display: 'inline-flex', gap: 5, alignItems: 'center' }}>
                <Button small warning href={`/grupo/${group.group_id.toString()}`} label="Editar Grupo" />
                {!tramit.complete && <DeleteButton small action={deleteOperationGroup.bind(null, group.group_id.toString())} />}
                <Pill label={formatToARS(group.total)} status='success' />
              </div>}
              >
              {group.operations.map(renderOperations)}
            </Card>
          } else return group.operations.map(renderOperations)
       })}
    </div>
  )

}
