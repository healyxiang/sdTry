import { authOptions } from '@/app/api/auth/[...nextauth]/config'
import { getServerSession } from 'next-auth/next'

export async function GET() {
  const session = await getServerSession(authOptions)
  console.log('session in server get:', session)
  const user = session?.user as { id: string; name: string; email: string; image: string }
  const userId = user?.id

  if (!session) {
    return Response.json({ msg: 'You must be logged in.' }, { status: 401 })
  }

  return Response.json(
    {
      msg: 'Success',
      userId: userId,
    },
    { status: 200 }
  )
  // return Response.json({
  //   message: 'Success',
  // })
}
