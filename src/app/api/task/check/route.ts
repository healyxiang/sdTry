import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/config'
import { getTask, updateTask } from '@/lib/db/task'
import { User } from '@/types/User'
import { TaskStatus } from '@prisma/client'
import { customFetch, stringifyBody } from '@/app/api/config'

const fetchQueuedImagesApi = 'https://modelslab.com/api/v6/images/fetch'
const requestId = '127680949'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  const user = session?.user as User

  if (!user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { taskId } = await request.json()

    if (!taskId) {
      return Response.json({ error: 'Task ID is required' }, { status: 400 })
    }

    const task = await getTask(taskId)

    if (!task) {
      return Response.json({ error: 'Task not found' }, { status: 404 })
    }

    // 验证任务属于当前用户
    if (task.userId !== user.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 检查 fetchUrl 和 requestId
    if (
      task.fetchUrl &&
      typeof task.fetchUrl === 'string' &&
      task.fetchUrl.startsWith('https://') &&
      task.requestId !== 'none'
    ) {
      try {
        const response = await customFetch(fetchQueuedImagesApi, {
          method: 'POST',
          body: stringifyBody({ request_id: task.requestId }),
        })
        const data = await response.json()
        console.log('data check:', data)
        // 根据返回的状态更新任务
        if (data.status?.toLowerCase() === 'success') {
          await updateTask(task.id, {
            status: TaskStatus.success,
            outputImage: data.output || [],
            futureLinks: data.output || [],
          })
          return Response.json({ status: 'completed', data })
        }

        if (data.status?.toLowerCase() === 'failed') {
          await updateTask(task.id, {
            status: TaskStatus.error,
            error: data.message || 'Task failed',
          })
          return Response.json({ status: 'failed', error: data.message })
        }

        // 如果还在处理中，保持当前状态
        return Response.json({ status: 'processing', data })
      } catch (error) {
        console.error('Error checking task status:', error)
        return Response.json({ error: 'Failed to check task status' }, { status: 500 })
      }
    }

    return Response.json({ message: 'No valid fetch URL or request ID' })
  } catch (error) {
    console.error('Error in check status:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
