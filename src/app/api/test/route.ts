import { authOptions } from '@/app/api/auth/[...nextauth]/config'
import { getServerSession } from 'next-auth/next'

export async function GET() {
  console.log('authOptions authOptions:', authOptions)
  const session = await getServerSession(authOptions)
  console.log(' session in server get:', session)
  if (!session) {
    return Response.json({ msg: 'You must be logged in.' }, { status: 401 })
  }

  return Response.json({ msg: 'Success' }, { status: 200 })
  // return Response.json({
  //   message: 'Success',
  // })
}
