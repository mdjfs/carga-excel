'use server'

import dbConnect from "@/database";
import Transaction from "@/database/models/Transaction";
import { revalidateTag } from "next/cache";
import { GET_TRANSACTIONS_TAG } from "./constants";


export async function deleteTransaction(transaction_id: string) {
    'use server'
    await dbConnect();
    await Transaction.findOneAndDelete({ _id: transaction_id });
    revalidateTag(GET_TRANSACTIONS_TAG)
}

