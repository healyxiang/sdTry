'use client'

import { Task, TaskStatus } from '@prisma/client'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { getStatusText, getPlaceholderImage } from './utils'
import TaskDetails from './TaskDetails'

interface TaskCardProps {
  task: Task
}

export default function TaskCard({ task }: TaskCardProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="group relative cursor-pointer overflow-hidden rounded-lg">
          {task.status === TaskStatus.success && task.outputImage?.length > 0 ? (
            <div className="grid">
              {task.outputImage.map((url, index) => (
                <div key={index} className="aspect-square">
                  <img
                    src={url}
                    alt={`Generated ${index + 1}`}
                    className="border-1 h-full w-full border-white object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="aspect-square">
              <div
                className={cn(
                  'absolute inset-0 flex items-center justify-center bg-black/50',
                  task.status === TaskStatus.error ? 'bg-red-500/50' : ''
                )}
              >
                <p className="text-lg font-medium text-white">{getStatusText(task.status)}</p>
              </div>
            </div>
          )}
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Task Details</DialogTitle>
        </DialogHeader>
        <TaskDetails task={task} />
      </DialogContent>
    </Dialog>
  )
}
