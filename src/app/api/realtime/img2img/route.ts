import { customFetch, stringifyBody } from '@/app/api/config'

export async function POST(req: Request) {
  console.log('text2img')
  const body = await req.json()
  const stringifyBodyData = stringifyBody(body)
  console.log('stringifyBodyData:', stringifyBodyData)
  const response = await customFetch('/realtime/img2img', {
    method: 'POST',
    body: stringifyBodyData,
  })
  return response
}
