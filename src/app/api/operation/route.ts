import Operation from "@/database/models/Operation"
import { NextRequest } from "next/server"

 
export async function DELETE(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const id = searchParams.get('id')
  await Operation.findOneAndDelete({ _id: id })
 
  return new Response('Operation removed', {
    status: 200
  })
}