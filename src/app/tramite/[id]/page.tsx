/* eslint-disable @typescript-eslint/no-explicit-any */
import { AFFILIATE_FIELDS } from "@/actions/constants";
import { createAffiliate } from "@/actions/createAffiliate";
import { createOperation } from "@/actions/createOperation";
import { getAffiliates } from "@/actions/getAffiliates";
import Button from "@/components/Button";
import Card from "@/components/Card";
import CreateButton from "@/components/CreateButton";
import CreateSelect from "@/components/CreateSelect";
import Input from "@/components/Input";
import dbConnect from "@/database";
import Operation from "@/database/models/Operation";
import Tramit from "@/database/models/Tramit";
import { notFound } from "next/navigation";
import { formatToARS } from "@/utils/money"

import styles from "./tramit.module.scss"
import Pill from "@/components/Pill";
import DeleteButton from "@/components/DeleteButton";
import ExcelButton from "@/components/ExcelButton";



interface TramitProps {
    params: { id: string };
}

export default async function Home({ params }: TramitProps) {
  await dbConnect();
  const tramit = await Tramit.findById(params.id).lean();
  if(!tramit) return notFound();
  const operations = await Operation.find({ tramit_id: tramit._id }).lean();

  const createOperationWithTramitId = createOperation.bind(null, tramit._id);

  const { affiliates } = await getAffiliates();

  const sumOperation = operations.reduce((acc, operation) => acc + operation.total, 0);
  const canSave = tramit.total - sumOperation === 0;

  return (
    <div style={{maxWidth: 1200, margin: 'auto', position: 'relative'}}>
       <div className={styles.headerContainer}>
         <div style={{ display: 'inline-flex', gap: 10 }}>
            <Button label="Volver" secondary href='/' />
            {!tramit.complete && <CreateButton createAction={createOperationWithTramitId} label="Nueva Operación" >
              <p><b>Nueva Operación para el Tramite {tramit.name}</b></p>
              <p>Ingrese el número del afiliado o el nombre del mismo</p>
              <CreateSelect required placeholder="Ingresa el numero o el nombre del afiliado" createAction={createAffiliate} searchKeys={[AFFILIATE_FIELDS.name, AFFILIATE_FIELDS.identifier]} name="Afiliado" data={affiliates} keyValue={AFFILIATE_FIELDS.identifier} keyText={AFFILIATE_FIELDS.name}>
                  <p>Nombre del Afiliado</p>
                  <Input name={AFFILIATE_FIELDS.name} placeholder="Nombre del Afiliado" />
                  <p>Identificador del Afiliado</p>
                  <Input name={AFFILIATE_FIELDS.identifier} placeholder="Identificador del Afiliado" />
              </CreateSelect>
            </CreateButton>}
            {!tramit.complete && <DeleteButton api={`api/tramit?id=${tramit._id}`} href="/" name="tramite" />}
         </div>
          {canSave && <ExcelButton tramitId={tramit._id.toString()} />}
          {!canSave && <div className={styles.totalContainer}>
            <div className={styles.tramitTotal}>Total <b>{formatToARS(tramit.total)}</b> </div>
            <div  className={styles.tramitRemaining}>Restante <b>{formatToARS(tramit.total - sumOperation)}</b> </div>  
          </div>}
       </div>
       <div style={{fontSize: 18, paddingTop: 20, paddingBottom: 10}}><b>Trámite {tramit.name}</b></div>
       {operations.length === 0 && <p>No hay operaciones creadas todavía.</p>}
       {operations.map(operation => {
          const affiliate = affiliates.find(affiliate => affiliate._id === operation.affiliate_id.toString());
          return <Card 
            key={operation._id.toString()} 
            title={`Afiliado ${affiliate?.name}`} 
            footer={<Pill label={formatToARS(operation.total)} status='success' />}
            href={`/operacion/${operation._id.toString()}`} 
          />
       })}
    </div>
  )

}
