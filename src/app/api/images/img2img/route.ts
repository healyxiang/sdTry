import { customFetch, stringifyBody } from '@/app/api/config'
// community-models

export async function POST(req: Request) {
  console.log('community img2img')
  const body = await req.json()
  const stringifyBodyData = stringifyBody(body)
  console.log('stringifyBodyData:', stringifyBodyData)
  const response = await customFetch('/images/img2img', {
    method: 'POST',
    body: stringifyBodyData,
  })
  return response
}
