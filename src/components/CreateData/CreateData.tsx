/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { AFFILIATE_FIELDS, GROUP_FIELDS, MEDICAL_STUDY_FIELDS, TRAMIT_FIELDS, TRAMIT_FIELDS_TXT, TRANSACTION_FIELDS } from "@/actions/constants";
import CreateButton from "../CreateButton";
import CreateSelect from "../CreateSelect";
import Input from "../Input";
import { createAffiliate } from "@/actions/createAffiliate";
import { getAffiliates } from "@/actions/getAffiliates";
import { createMedicalStudy } from "@/actions/createMedicalStudy";
import { getMedicalStudies } from "@/actions/getMedicalStudies";


interface CreateDataProps {
    action: (formData: FormData) => Promise<any>;
    type: 'operation' | 'tramit' | 'group' | 'transaction' | 'tramit-txt'
}

export default async function CreateData ({ action, type }: CreateDataProps) {
    if(type === 'operation') {
        const { affiliates } = await getAffiliates();
        return <CreateButton createAction={action} label="Nueva Operación" >
            <p><b>Nueva Operación</b></p>
            <p>Ingrese el número del afiliado o el nombre del mismo</p>
            <CreateSelect required placeholder="Ingresa el numero o el nombre del afiliado" data={affiliates} createAction={createAffiliate} searchKeys={[AFFILIATE_FIELDS.name, AFFILIATE_FIELDS.identifier]} name="Afiliado" keyValue={AFFILIATE_FIELDS.identifier} keyText={AFFILIATE_FIELDS.name} >
                <p>Nombre del Afiliado</p>
                <Input name={AFFILIATE_FIELDS.name} placeholder="Nombre del Afiliado" />
                <p>Identificador del Afiliado</p>
                <Input name={AFFILIATE_FIELDS.identifier} placeholder="Identificador del Afiliado" validator={{ type: 'identifier', message: 'El identificador del afiliado tiene que tener 10 digitos' }}  />
            </CreateSelect>
        </CreateButton>
    }
    if(type === 'group') {
        const { medicalStudies } = await getMedicalStudies();
        return <CreateButton createAction={action} label="Crear Grupo" redirectUri="/grupo/[id]">
            <p><b>Crear Operaciones por grupo</b></p>
            <p>Identificador del Grupo</p>
            <Input name={GROUP_FIELDS.name} placeholder="Identificador del Grupo"  required />
            <p>Cantidad de Trámites</p>
            <Input name={GROUP_FIELDS.quantity} placeholder="Cantidad de Trámites" type="number" required formatter="integer" />
            <p>Monto Total</p>
            <Input name={GROUP_FIELDS.total} placeholder="Monto Total" type="number" required />
            <p>Estudio Médico</p>
            <CreateSelect required data={medicalStudies} placeholder="Ingrese el código del estudio médico o el nombre del mismo" createAction={createMedicalStudy} searchKeys={[MEDICAL_STUDY_FIELDS.name, MEDICAL_STUDY_FIELDS.code]} name="Estudio" keyValue={MEDICAL_STUDY_FIELDS.code} keyText={MEDICAL_STUDY_FIELDS.name}>
                <p>Nombre del Estudio Médico</p>
                <Input name={MEDICAL_STUDY_FIELDS.name} placeholder="Nombre del Estudio Médico" required />
                <p>Código del Estudio Médico</p>
                <p>(Dejar en blanco si no tiene código)</p>
                <Input validator={{ type: 'code', message: 'El código del estudio tiene que tener 6 digitos' }} name={MEDICAL_STUDY_FIELDS.code} placeholder="Código del Estudio Médico" />
            </CreateSelect>
        </CreateButton>
    }
    if(type === 'transaction') {
        const { medicalStudies } = await getMedicalStudies();
        return <CreateButton createAction={action} label="Nuevo" >
            <p><b>Nuevo Estudio</b></p>
            <p>Ingrese el código del estudio médico o el nombre del mismo</p>
            <CreateSelect required placeholder="Ingrese el código del estudio médico o el nombre del mismo" createAction={createMedicalStudy} searchKeys={[MEDICAL_STUDY_FIELDS.name, MEDICAL_STUDY_FIELDS.code]} name="Estudio" data={medicalStudies} keyValue={MEDICAL_STUDY_FIELDS.code} keyText={MEDICAL_STUDY_FIELDS.name}>
                <p>Nombre del Estudio Médico</p>
                <Input name={MEDICAL_STUDY_FIELDS.name} placeholder="Nombre del Estudio Médico" />
                <p>Código del Estudio Médico</p>
                <Input validator={{ type: 'code', message: 'El código del estudio tiene que tener 6 digitos' }} name={MEDICAL_STUDY_FIELDS.code} placeholder="Código del Estudio Médico" />
            </CreateSelect>
            <p>Fecha</p>
            <Input name={TRANSACTION_FIELDS.date} placeholder="Fecha" formatter="date" required validator={{ type: 'date', message: 'Ingresa una fecha válida en formato dd/mm/yyyy'}} />
            <p>Precio</p>
            <Input name={TRANSACTION_FIELDS.price} placeholder="Precio" type="number" required />
            <p>Cantidad</p>
            <Input name={TRANSACTION_FIELDS.quantity} placeholder="Cantidad" type="number" formatter='integer' required />
            <p>Coseguro</p>
            <Input name={TRANSACTION_FIELDS.copay} placeholder="Coseguro" type="number" />
        </CreateButton>
    }
    if(type === 'tramit') {
        return <CreateButton createAction={action} label="Nuevo Trámite" redirectUri="/tramite/[id]">
          <p>Nombre del Trámite</p>
          <Input name={TRAMIT_FIELDS.name} placeholder="Nombre del Trámite" required />
          <p>Monto Total del Trámite</p>
          <Input type="number" name={TRAMIT_FIELDS.total} placeholder="Monto Total del Trámite" required />
        </CreateButton>
    }
    if(type === 'tramit-txt') {
        return <CreateButton createAction={action} label="Cargar Trámite" redirectUri="/tramite/[id]" warning>
            <p><b>Cargar trámite via archivo .txt</b></p>
            <p>Seleccione el Archivo</p>
            <Input type="file" name={TRAMIT_FIELDS_TXT.file} required />
        </CreateButton>
    }
}