/* eslint-disable @typescript-eslint/no-explicit-any */
import { Task, TaskType, TaskStatus } from '@prisma/client'
import prisma from '@/lib/prima'
import { JsonValue } from '@prisma/client/runtime/library'

interface CreateTaskInput {
  type: TaskType
  status: TaskStatus
  userId: string
  requestId: string
  prompt?: string
  initImage?: string
  modelId?: string
  settings?: any
  fetchUrl?: string
  futureLinks?: string[]
}

interface UpdateTaskInput {
  status?: TaskStatus
  requestId?: string
  outputImage?: string[]
  error?: string
  fetchUrl?: string
  futureLinks?: string[]
}

// 创建新任务
export async function createTask(input: CreateTaskInput): Promise<Task> {
  console.log('createTask input:', input)
  return prisma.task.create({
    data: {
      ...input,
      // type: 'IMG2IMG',
      // prompt: 'dddddd',
      // initImage: 'https://assets.yt2pod.one/TEULhxihhx.jpeg',
      // modelId: 'crystal-clear-xlv1',
      // requestId: '123',
      // status: TaskStatus.processing,
      // userId: '123',
      // settings: input.settings,
      // fetchUrl: input.fetchUrl,
      // futureLinks: input.futureLinks || [],
      // status: input.status as TaskStatus,
    },
  })
}

// 更新任务状态
export async function updateTask(taskId: string, input: UpdateTaskInput): Promise<Task> {
  console.log('updateTask input:', input)
  try {
    return await prisma.task.update({
      where: { id: taskId },
      data: {
        // ...(input.status && { status: input.status }),
        // ...(input.outputImage && { outputImage: input.outputImage }),
        // ...(input.error && { error: input.error }),
        // ...(input.fetchUrl && { fetchUrl: input.fetchUrl }),
        // ...(input.futureLinks && { futureLinks: input.futureLinks }),
        // ...(input.requestId && { requestId: input.requestId }),
        ...input,
      },
    })
  } catch (error) {
    console.error('updateTask error:', error)
    throw error
  }
}

// 获取单个任务
export async function getTask(taskId: string): Promise<Task | null> {
  return prisma.task.findUnique({
    where: { id: taskId },
  })
}

// 获取用户的所有任务
export async function getUserTasks(
  userId: string,
  options?: {
    type?: TaskType
    status?: TaskStatus
    limit?: number
    offset?: number
  }
): Promise<{ tasks: Task[]; total: number }> {
  const where = {
    userId,
    ...(options?.type && { type: options.type }),
    ...(options?.status && { status: options.status }),
  }

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: options?.offset || 0,
      take: options?.limit || 10,
    }),
    prisma.task.count({ where }),
  ])

  return { tasks, total }
}

// 删除任务
export async function deleteTask(taskId: string): Promise<Task> {
  return prisma.task.delete({
    where: { id: taskId },
  })
}

// 批量删除任务
export async function deleteManyTasks(taskIds: string[]): Promise<{ count: number }> {
  return prisma.task.deleteMany({
    where: {
      id: {
        in: taskIds,
      },
    },
  })
}

// 更新任务状态为失败
export async function markTaskAsFailed(taskId: string, error: string): Promise<Task> {
  return prisma.task.update({
    where: { id: taskId },
    data: {
      status: TaskStatus.error,
      error,
    },
  })
}

// 更新任务状态为完成
export async function markTaskAsCompleted(taskId: string, outputImage: string[]): Promise<Task> {
  return prisma.task.update({
    where: { id: taskId },
    data: {
      status: TaskStatus.success,
      outputImage,
    },
  })
}
