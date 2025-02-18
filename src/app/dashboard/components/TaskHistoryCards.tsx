'use client'

import { useEffect, useState } from 'react'
import { Task, TaskStatus } from '@prisma/client'
import { useSession } from 'next-auth/react'
import TaskCard from './TaskCard'
import Pagination from './Pagination'

interface TaskHistoryResponse {
  tasks: Task[]
  total: number
}

export default function TaskHistoryCards() {
  const { data: session } = useSession()
  const [tasks, setTasks] = useState<Task[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const limit = 12

  const checkTaskStatus = async (taskId: string) => {
    try {
      const response = await fetch('/api/task/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId }),
      })

      const data = await response.json()
      if (data.status === 'completed' || data.status === 'failed') {
        fetchTasks()
      }
      return data
    } catch (error) {
      console.error('Error checking task status:', error)
    }
  }

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/task/list?limit=${limit}&offset=${(page - 1) * limit}`)
      const data: TaskHistoryResponse = await response.json()
      setTasks(data.tasks)
      setTotal(data.total)

      data.tasks.forEach((task) => {
        if (
          task.status === TaskStatus.processing &&
          task.fetchUrl &&
          task.fetchUrl.startsWith('https://')
        ) {
          checkTaskStatus(task.id)
        }
      })
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (session) {
      fetchTasks()
    }
  }, [session, page])

  if (!session) {
    return <div>Please sign in to view your task history.</div>
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Generation History</h2>
        <div className="text-sm text-gray-500">Total: {total}</div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="aspect-square animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800"
            />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
          <Pagination page={page} total={total} limit={limit} onPageChange={setPage} />
        </>
      )}
    </div>
  )
}
