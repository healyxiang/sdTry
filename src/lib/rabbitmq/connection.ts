import amqp, { Channel, Connection } from 'amqplib'

let connection: Connection | null = null
let channel: Channel | null = null

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672'
const QUEUE_NAME = 'task_status_queue'

export async function connectQueue() {
  try {
    connection = await amqp.connect(RABBITMQ_URL)
    channel = await connection.createChannel()

    await channel.assertQueue(QUEUE_NAME, {
      durable: true, // 队列持久化
    })

    console.log('Connected to RabbitMQ')
    return channel
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error)
    throw error
  }
}

export async function getChannel(): Promise<Channel> {
  if (!channel) {
    await connectQueue()
  }
  if (!channel) {
    throw new Error('Failed to create RabbitMQ channel')
  }
  return channel
}

export async function closeConnection() {
  try {
    if (channel) {
      await channel.close()
    }
    if (connection) {
      await connection.close()
    }
  } catch (error) {
    console.error('Error closing RabbitMQ connection:', error)
  }
}

// 确保在应用关闭时关闭连接
process.on('SIGINT', async () => {
  await closeConnection()
  process.exit(0)
})
