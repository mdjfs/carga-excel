import { TRAMIT_FIELDS } from "@/actions/constants";
import { createTramit } from "@/actions/createTramit";
import { getTramits } from "@/actions/getTramits";
import Button from "@/components/Button";
import Card from "@/components/Card";
import CreateButton from "@/components/CreateButton";
import Input from "@/components/Input";
import Pill from "@/components/Pill";


interface HomeProps {
  searchParams: {
      [key: string]: string
  };
}


export default async function Home({ searchParams }: HomeProps) {
  const { complete } = searchParams
  const { tramits } = await getTramits(complete);


  return (
      <div style={{maxWidth: 1200, margin: 'auto', position: 'relative'}}>
        <CreateButton createAction={createTramit} label="Nuevo Trámite" redirectUri="/tramite/[id]">
          <p>Nombre del Trámite</p>
          <Input name={TRAMIT_FIELDS.name} placeholder="Nombre del Trámite" required />
          <p>Monto Total del Trámite</p>
          <Input type="number" name={TRAMIT_FIELDS.total} placeholder="Monto Total del Trámite" required />
        </CreateButton>
        {tramits.length === 0 && <p>No hay trámites creados todavía.</p>}
        {tramits.length > 0 && <>
          {complete === undefined && <>
            <p>Filtrar por</p>
            <div style={{display: 'inline-flex', gap: 10}}>
              <Pill label="en progreso" href="/?complete=false"/>
              <Pill label="completadas" href="/?complete=true" status="success"/>
            </div>
          </>}
          {complete !== undefined && 
          <div style={{display: 'block', marginTop: 30}}>
            <Button label="Borrar Filtros" href="/" />  
          </div>}
          {tramits.map(tramit => 
            <Card 
                key={tramit._id} 
                title={`Trámite ${tramit.name}`} 
                footer={tramit.complete ? <Pill label="completada" status="success"/> : <Pill label="en progreso"/>} 
                href={`/tramite/${tramit._id}`} 
              />
          )}
        </>}
      </div>
  );
}
