import { Metadata } from 'next'
import TaskHistoryCards from './components/TaskHistoryCards'

export const metadata: Metadata = {
  title: 'Dashboard - Task History',
  description: 'View your image generation task history',
}

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Dashboard</h1>
      <TaskHistoryCards />
    </div>
  )
}
