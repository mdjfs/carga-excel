import { GET_TRAMITS_TAG } from "@/actions/constants"
import Tramit from "@/database/models/Tramit"
import { revalidateTag } from "next/cache"
import { NextRequest } from "next/server"

 
export async function DELETE(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const id = searchParams.get('id')
  await Tramit.findOneAndDelete({ _id: id })
  revalidateTag(GET_TRAMITS_TAG)
 
  return new Response('Operation removed', {
    status: 200
  })
}