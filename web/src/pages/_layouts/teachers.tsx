import { AppWrapper } from '@/components/app-wrapper'
import { LayoutDashboard, MessageCircle, Video } from 'lucide-react'

export function TeachersLayout() {
  const userItems = [
    {
      label: 'Início',
      pathname: '/teachers',
      Icon: LayoutDashboard
    },
    {
      label: 'Cursos',
      pathname: '/teachers/courses',
      Icon: Video
    },
    {
      label: 'Feedbacks',
      pathname: '/teachers/feedbacks',
      Icon: MessageCircle
    }
  ]
  return <AppWrapper items={userItems} allowedRoles={['ADMIN', 'TEACHER']} />
}
