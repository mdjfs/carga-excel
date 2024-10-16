'use server'

import dbConnect from "@/database";
import { GET_OPERATIONS_TAG } from "./constants";
import { revalidateTag } from "next/cache";
import Operation from "@/database/models/Operation";


export async function deleteOperationGroup(group_id: string) {
    'use server'
    await dbConnect();
    await Operation.deleteMany({ group_id });
    revalidateTag(GET_OPERATIONS_TAG);
}

