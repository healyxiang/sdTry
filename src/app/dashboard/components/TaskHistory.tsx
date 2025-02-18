'use client'

import { useEffect, useState } from 'react'
import { Task, TaskStatus, TaskType } from '@prisma/client'
import { useSession } from 'next-auth/react'

interface TaskHistoryResponse {
  tasks: Task[]
  total: number
}

export default function TaskHistory() {
  const { data: session } = useSession()
  const [tasks, setTasks] = useState<Task[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const limit = 10

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
        // 重新获取任务列表以更新状态
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
      console.log('data in fetchTasks:', data)
      setTasks(data.tasks)
      setTotal(data.total)

      // 检查处理中的任务状态
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

  const getStatusBadgeColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.success:
        return 'bg-green-100 text-green-800'
      case TaskStatus.processing:
        return 'bg-blue-100 text-blue-800'
      case TaskStatus.error:
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!session) {
    return <div>Please sign in to view your task history.</div>
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Task History</h2>
        <div className="text-sm text-gray-500">Total: {total}</div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">Loading...</div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Result
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td className="whitespace-nowrap px-6 py-4">{task.type}</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusBadgeColor(
                          task.status
                        )}`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {new Date(task.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      {task.outputImage && task.outputImage.length > 0 ? (
                        <div className="flex gap-2">
                          {task.outputImage.map((url, index) => (
                            <img
                              key={index}
                              src={url}
                              alt={`Result ${index + 1}`}
                              className="h-16 w-16 rounded object-cover"
                            />
                          ))}
                        </div>
                      ) : task.error ? (
                        <span className="text-red-500">{task.error}</span>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between">
            <button
              className="rounded bg-gray-100 px-4 py-2 text-sm disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span className="text-sm text-gray-500">
              Page {page} of {Math.ceil(total / limit)}
            </span>
            <button
              className="rounded bg-gray-100 px-4 py-2 text-sm disabled:opacity-50"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= Math.ceil(total / limit)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  )
}
