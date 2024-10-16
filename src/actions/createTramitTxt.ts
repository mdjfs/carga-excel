'use server'

import dbConnect from "@/database";
import Tramit from "@/database/models/Tramit";
import { GET_TRAMITS_TAG, TRAMIT_FIELDS_TXT } from "./constants";
import { revalidateTag } from "next/cache";
import { NO_STUDY_CODE } from "@/utils/constants";
import MedicalStudies from "@/database/models/MedicalStudies";
import Affiliate from "@/database/models/Affiliate";
import { sumAll } from "@/utils/sum";
import Operation from "@/database/models/Operation";
import Transaction from "@/database/models/Transaction";
import { getDate } from "@/utils/date";


export async function createTramitTxt(formData: FormData) {
    'use server'
    const file = formData.get(TRAMIT_FIELDS_TXT.file) as File;
    if(!file.name.endsWith('.txt')) throw new Error('Esto no es un txt')
    const arrayBuffer = await file.arrayBuffer();
    const decoder = new TextDecoder('utf-8');
    const text = decoder.decode(arrayBuffer)
    const lines = text.split('\n');
    const data = lines.filter(line => !!line).map((line) => {
        line = line.replace(/\|\|/g, '|');
        const columns = line.split('|');
        const txtDate = columns[7]?.trim().replace(/\//g, '')
        const date = `${txtDate.slice(6, 8)}/${txtDate.slice(4, 6)}/${txtDate.slice(0, 4)}`
        let identifier = parseInt(columns[4]?.trim().replace(/\//g, ''));
        if(identifier && identifier.toString().length === 8) identifier = parseInt(`${identifier}00`)
        return {
            affiliate: {
                identifier,
                name: columns[5]?.trim(),
            },
            date,
            medical_study: {
                code: parseInt(columns[10]?.trim()),
                name: columns[11]?.trim(),
            },
            quantity: parseInt(columns[12]?.trim()),
            price: parseFloat(columns[13]?.trim().replace(/\./g,'').replace(/\,/g, '.')),
            copay: parseFloat(columns[16]?.trim().replace(/\./g,'').replace(/\,/g, '.')),
        }
    })
    const total = sumAll(data, (line) => (line.price * line.quantity) - line.copay)
    await dbConnect();
    const tramit = await Tramit.create({ name: file.name.replace('.txt',''), total })
    try {
        for(const line of data) {
            let medicalStudy;
            if(line.medical_study.code === NO_STUDY_CODE) {
                medicalStudy = await MedicalStudies.findOne({ name: line.medical_study.name })
                if(!medicalStudy) {
                    medicalStudy = await MedicalStudies.create({ name: line.medical_study.name })
                    await medicalStudy.save()
                }
            } else {
                medicalStudy = await MedicalStudies.findOne({ code: line.medical_study.code })
                if(!medicalStudy) {
                    medicalStudy = await MedicalStudies.create({ code: line.medical_study.code, name: line.medical_study.name })
                    await medicalStudy.save()
                }
            }
            if(medicalStudy) {
                let affiliate;
                affiliate = await Affiliate.findOne({ identifier: line.affiliate.identifier })
                if(!affiliate) {
                    affiliate = await Affiliate.create({ identifier: line.affiliate.identifier, name: line.affiliate.name })
                    await affiliate.save()
                }
                if(affiliate) {
                    const operation = await Operation.create({ affiliate_id: affiliate._id, tramit_id: tramit._id, total: (line.price * line.quantity) - line.copay });
                    const date = getDate(line.date)
                    await operation.save()
                    const transaction = await Transaction.create({ 
                        operation_id: operation._id,
                        medical_study_id: medicalStudy._id,
                        price: line.price,
                        quantity: line.quantity,
                        copay: line.copay,
                        date
                    })
                    await transaction.save()
                }
            }
        }
        tramit.save()
        revalidateTag(GET_TRAMITS_TAG)
        return {
            _id: tramit._id.toString(),
            name: tramit.name,
            total: tramit.total
        }
    } catch (err) {
        console.error(err)
        await Tramit.findOneAndDelete({ _id: tramit._id })
        throw new Error('Hubo un error cargando el documento')
    } 
}

