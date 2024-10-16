/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import dbConnect from "@/database";
import { GET_TRANSACTIONS_TAG } from "./constants";
import Transaction from "@/database/models/Transaction";

export async function getTransactions(operation_id: string) {
    'use server'
    await dbConnect();
    const transactions = await Transaction.find({ operation_id }).sort({ _id: -1 }).lean();

    return { transactions: transactions.map(transaction => ({
        _id: transaction._id.toString(),
        operation_id: transaction.operation_id.toString(),
        medical_study_id: transaction.medical_study_id.toString(),
        quantity: transaction.quantity,
        price: transaction.price,
        copay: transaction.copay,
        date: transaction.date
    })), tag: GET_TRANSACTIONS_TAG };
}