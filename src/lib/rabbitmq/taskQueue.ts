import { Channel } from 'amqplib'
import { getChannel } from './connection'
import { updateTask } from '@/lib/db/task'
import { TaskStatus } from '@prisma/client'
import { customFetch, stringifyBody } from '@/app/api/config'

const QUEUE_NAME = 'task_status_queue'
const CHECK_INTERVAL = 20000 // 20 seconds

const fetchQueuedImagesApi = 'https://modelslab.com/api/v6/images/fetch'

interface TaskMessage {
  taskId: string
  requestId: string
  fetchUrl: string
}

export async function enqueueTask(taskMessage: TaskMessage) {
  try {
    const channel = await getChannel()
    await channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(taskMessage)), {
      persistent: true, // 消息持久化
    })
    console.log('Task enqueued:', taskMessage)
  } catch (error) {
    console.error('Error enqueueing task:', error)
    throw error
  }
}

export async function startTaskProcessor() {
  try {
    const channel = await getChannel()

    // 设置预取数量为1，确保消息处理的负载均衡
    await channel.prefetch(1)

    console.log('Task processor started')

    const processMessage = async (msg: any) => {
      if (!msg) return

      try {
        const taskMessage: TaskMessage = JSON.parse(msg.content.toString())
        console.log('Processing task:', taskMessage)

        const result = await checkTaskStatus(taskMessage)

        if (result.status === 'processing') {
          // 如果任务仍在处理中，重新入队
          channel.nack(msg, false, true)
        } else {
          // 任务完成或失败，确认消息
          channel.ack(msg)
        }
      } catch (error) {
        console.error('Error processing message:', error)
        // 发生错误时，重新入队
        channel.nack(msg, false, true)
      }
    }

    // 消费消息
    await channel.consume(QUEUE_NAME, processMessage)
  } catch (error) {
    console.error('Error starting task processor:', error)
  }
}

async function checkTaskStatus(taskMessage: TaskMessage) {
  const { taskId, requestId, fetchUrl } = taskMessage

  if (!fetchUrl || !fetchUrl.startsWith('https://')) {
    throw new Error('Invalid fetch URL')
  }

  try {
    // const response = await customFetch('/images/fetch', {
    //   method: 'POST',
    //   body: stringifyBody({ request_id: requestId }),
    // })

    const response = await customFetch(fetchQueuedImagesApi, {
      method: 'POST',
      body: stringifyBody({ request_id: requestId }),
    })

    const data = await response.json()
    console.log('Task status check result:', data)

    if (data.status?.toLowerCase() === 'success') {
      await updateTask(taskId, {
        status: TaskStatus.success,
        outputImage: data.output || [],
        futureLinks: data.output || [],
      })
      return { status: 'success' }
    }

    if (data.status?.toLowerCase() === 'error') {
      await updateTask(taskId, {
        status: TaskStatus.error,
        error: data.message || 'Task failed',
      })
      return { status: 'error' }
    }

    return { status: 'processing' }
  } catch (error) {
    console.error('Error checking task status:', error)
    throw error
  }
}
