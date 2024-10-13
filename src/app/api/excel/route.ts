/* eslint-disable @typescript-eslint/no-explicit-any */
import dbConnect from '@/database';
import Affiliate from '@/database/models/Affiliate';
import MedicalStudies from '@/database/models/MedicalStudies';
import Operation from '@/database/models/Operation';
import Tramit from '@/database/models/Tramit';
import Transaction from '@/database/models/Transaction';
import { formatDateToDDMMYYYY } from '@/utils/date';
import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const tramitId = searchParams.get('tramitId')
    const res = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL}/plantilla.xls`);
    if (!res.ok) {
        return NextResponse.json({ message: 'Error al obtener el archivo.' }, { status: 500 });
    }

    const data = await res.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];


    const getCell = (item: any) => {
        if(item instanceof Date) return { v: formatDateToDDMMYYYY(item), t: 's', w: formatDateToDDMMYYYY(item) };
        if(typeof item === 'string') return { v: item, t: 's', w: item };
        if(typeof item === 'number') return { v: item, t: 'n', w: item.toString() };
    }

    let i = 1;

    await dbConnect();
    const tramit = await Tramit.findById(tramitId).lean()
    if(!tramit) return NextResponse.json({ message: 'Trámite no encontrado.' }, { status: 404 });


    const operations = await Operation.find({ tramit_id: tramit._id }).lean()
    for(const operation of operations) {
        const affiliate = await Affiliate.findById(operation.affiliate_id).lean()
        const transactions = await Transaction.find({ operation_id: operation._id }).lean()
        for(const transaction of transactions) {
            const cellDateRef = XLSX.utils.encode_cell({ r: i, c: 0 })
            const cellIdentifierRef = XLSX.utils.encode_cell({ r: i, c: 1 })
            const cellCodeRef = XLSX.utils.encode_cell({ r: i, c: 3 })
            const cellQuantityRef = XLSX.utils.encode_cell({ r: i, c: 4 })
            const cellPriceRef = XLSX.utils.encode_cell({ r: i, c: 5 })
            const cellCopayRef = XLSX.utils.encode_cell({ r: i, c: 8 })
            const cellTotalRef = XLSX.utils.encode_cell({ r: i, c: 9 });
            const cellNetTotalRef = XLSX.utils.encode_cell({ r: i, c: 10 });
            const medicalStudy = await MedicalStudies.findById(transaction.medical_study_id).lean()
            worksheet[cellDateRef] = getCell(transaction.date)
            worksheet[cellIdentifierRef] = getCell(affiliate?.identifier)
            worksheet[cellCodeRef] = getCell(medicalStudy?.code)
            worksheet[cellQuantityRef] = getCell(transaction.quantity)
            worksheet[cellPriceRef] = getCell(transaction.price)
            if(transaction.copay) worksheet[cellCopayRef] = getCell(transaction.copay)
            worksheet[cellTotalRef] = getCell(transaction.price * transaction.quantity); 
            worksheet[cellNetTotalRef] = getCell((transaction.price * transaction.quantity) - transaction.copay); 
            i++;
        }
    }

    const modifiedFileBuffer = XLSX.write(workbook, { bookType: 'xls', type: 'array' });

    await Tramit.findOneAndUpdate({ _id: tramit._id }, { $set: { complete: true } });

    const response = new Response(modifiedFileBuffer, {
        headers: {
            'Content-Type': 'application/vnd.ms-excel',
            'Content-Disposition': 'attachment; filename=modified_data.xls',
        },
    });

    return response;
}
