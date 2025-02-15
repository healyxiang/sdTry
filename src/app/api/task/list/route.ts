import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/config'
import { getUserTasks } from '@/lib/db/task'
import { User } from '@/types/User'
import { TaskType, TaskStatus } from '@prisma/client'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  const user = session?.user as User

  if (!user?.id) {
    return Response.json({ tasks: [], total: 0 })
  }

  try {
    // 从 URL 获取查询参数
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    const result = await getUserTasks(user.id, {
      type: type as TaskType, // TaskType
      status: status as TaskStatus, // TaskStatus
      limit,
      offset,
    })

    return Response.json(result)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return Response.json({ error: 'Failed to fetch tasks', tasks: [], total: 0 }, { status: 500 })
  }
}
