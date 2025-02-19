import { startTaskProcessor } from '@/lib/rabbitmq/taskQueue'

// 在应用启动时调用
export async function initializeServices() {
  try {
    await startTaskProcessor()
    console.log('Task processor initialized')
  } catch (error) {
    console.error('Failed to initialize task processor:', error)
  }
}
