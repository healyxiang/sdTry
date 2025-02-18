import { Task, TaskStatus } from '@prisma/client'
import { cn } from '@/lib/utils'
import { getStatusText } from './utils'

interface TaskDetailsProps {
  task: Task
}

export default function TaskDetails({ task }: TaskDetailsProps) {
  return (
    <div className="mt-4">
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Original Image */}
          {task.initImage && (
            <div>
              <h3 className="mb-2 font-medium">Original Image</h3>
              <img src={task.initImage} alt="Original" className="w-full rounded-lg object-cover" />
            </div>
          )}
          {/* Generated Images */}
          {task.outputImage && task.outputImage.length > 0 && (
            <div>
              <h3 className="mb-2 font-medium">Generated Results</h3>
              <div className="grid grid-cols-2 gap-2">
                {task.outputImage.map((url, index) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={index}
                    src={url}
                    alt={`Generated ${index + 1}`}
                    className="min-h-[200px] w-full rounded-lg object-cover"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Task Information */}
        <div className="grid gap-2">
          <div>
            <span className="font-medium">Status: </span>
            <span
              className={cn('rounded-full px-2 py-1 text-sm', {
                'bg-green-100 text-green-800': task.status === TaskStatus.success,
                'bg-blue-100 text-blue-800': task.status === TaskStatus.processing,
                'bg-red-100 text-red-800': task.status === TaskStatus.error,
              })}
            >
              {getStatusText(task.status)}
            </span>
          </div>
          <div>
            <span className="font-medium">Task Id: </span>
            {task.id}
          </div>
          <div>
            <span className="font-medium">Created At: </span>
            {new Date(task.createdAt).toLocaleString()}
          </div>
          {task.error && (
            <div>
              <span className="font-medium">Error Message: </span>
              <span className="text-red-500">{task.error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
