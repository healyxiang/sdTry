import { customFetch, stringifyBody } from '@/app/api/config'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/config'
import { createTask, updateTask } from '@/lib/db/task'
import { TaskStatus, TaskType } from '@prisma/client'
import { User } from '@/types/User'

export async function POST(req: Request) {
  // 获取用户会话
  const session = await getServerSession(authOptions)
  const user = session?.user as User
  if (!user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    console.log('body in img2img route:', body)
    const stringifyBodyData = stringifyBody(body)

    // 创建初始任务记录
    const task = await createTask({
      type: 'IMG2IMG',
      userId: user.id,
      initImage: body.init_image, // 初始图片URL
      modelId: body.model_id || 'default',
      settings: {
        ...body,
        initImg: undefined, // 避免重复存储
        modelId: undefined,
      },
      prompt: body.prompt,
      status: TaskStatus.processing,
      requestId: 'none', // 初始设置为 none
    })

    // 调用外部API
    const response = await customFetch('/images/img2img', {
      method: 'POST',
      body: stringifyBodyData,
    })

    console.log('response in img2img route:', response)

    if (response.status !== 200) {
      // 如果API调用失败，更新任务状态
      const errorData = await response.json()
      await updateTask(task.id, {
        status: TaskStatus.error,
        error: errorData.message || 'API request failed',
        requestId: 'none', // 更新 requestId
      })
      return response
    }

    // 解析API响应
    const data = await response.json()
    console.log('data in img2img route:', data)

    if (data.status.toLowerCase() === 'processing') {
      await updateTask(task.id, {
        status: TaskStatus.processing,
        fetchUrl: data.fetch_result,
        outputImage: data.output || [],
        futureLinks: data.future_links || [],
        requestId: String(data.id) || 'none', // 更新 requestId
      })
    }
    if (data.status.toLowerCase() === 'success') {
      // 更新任务状态为成功
      await updateTask(task.id, {
        status: TaskStatus.success,
        outputImage: data.output, // 假设输出图片在这个位置
        futureLinks: data.output || [], // 存储所有输出图片链接
        requestId: String(data.id) || 'none', // 更新 requestId
      })
    }

    if (data.status.toLowerCase() === 'error') {
      await updateTask(task.id, {
        status: TaskStatus.error,
        error: data.message || 'API request failed',
        requestId: String(data.id) || 'none', // 更新 requestId
      })
    }

    return Response.json(data)
  } catch (error) {
    console.log('Error in img2img route:', error)

    // 如果是已创建的任务发生错误
    if (error instanceof Error) {
      return Response.json({ error: error.message || 'Internal server error' }, { status: 500 })
    }

    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
