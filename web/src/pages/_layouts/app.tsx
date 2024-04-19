import { AppWrapper } from '@/components/app-wrapper'
import { Home, Video } from 'lucide-react'

export function AppLayout() {
  const userItems = [
    {
      label: 'Início',
      pathname: '/app',
      Icon: Home
    },
    {
      label: 'Cursos',
      pathname: '/app/courses',
      Icon: Video
    }
  ]
  return (
    <AppWrapper items={userItems} allowedRoles={['USER', 'TEACHER', 'ADMIN']} />
  )
}
