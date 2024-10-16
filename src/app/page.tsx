import { createTramit } from "@/actions/createTramit";
import { deleteTramit } from "@/actions/deleteTramit";
import { getTramits } from "@/actions/getTramits";
import Button from "@/components/Button";
import Card from "@/components/Card";
import CreateData from "@/components/CreateData";
import DeleteButton from "@/components/DeleteButton";
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
        <CreateData type="tramit" action={createTramit}/>
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
                footer={<div style={{display: 'inline-flex', gap: 5, alignItems: 'center'}}>
                  {!tramit.complete && <DeleteButton small action={deleteTramit.bind(null, tramit._id)} />}
                  {tramit.complete ? <Pill label="completada" status="success"/> : <Pill label="en progreso"/>}
                </div>} 
                href={`/tramite/${tramit._id}`} 
              />
          )}
        </>}
      </div>
  );
}
