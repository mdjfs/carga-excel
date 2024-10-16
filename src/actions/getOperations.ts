/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import dbConnect from "@/database";
import { GET_OPERATIONS_TAG } from "./constants";
import Operation from "@/database/models/Operation";
import { sumAll } from "@/utils/sum";
import Group from "@/database/models/Group";
import { ObjectId } from "mongodb";


export async function getOperations(tramitId: string) {
    'use server'
    await dbConnect();
    const items = await Operation.aggregate([
        {
            $match: { tramit_id: new ObjectId(tramitId)  }
        },
        {
            $group: {
                _id: "$group_id",
                items: { $push: "$$ROOT" }
            }
        }
    ]);

    const groups = [];

    for(let i=0; i<items.length; i++) {
        const item = items[i];
        const group = await Group.findById(item._id).lean();
        groups.push({ 
            group_id: group?._id.toString(),
            group_name: group?.name,
            operations: item.items.map((operation: any) => ({
                _id: operation._id.toString(),
                affiliate_id: operation.affiliate_id.toString(),
                tramit_id: operation.tramit_id.toString(),
                group_id: operation.group_id?.toString(),
                total: operation.total
            })),
            total: sumAll(item.items, (item) => item.total)
        });
    }


    return { groups, tag: GET_OPERATIONS_TAG };
}