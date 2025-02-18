import { TaskStatus } from '@prisma/client'

export const getStatusText = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.success:
      return 'Generation Complete'
    case TaskStatus.processing:
      return 'Generating...'
    case TaskStatus.error:
      return 'Generation Failed'
    default:
      return 'Pending...'
  }
}

export const getPlaceholderImage = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.processing:
      return '/placeholders/processing.png'
    case TaskStatus.error:
      return '/placeholders/failed.png'
    default:
      return '/placeholders/pending.png'
  }
}
