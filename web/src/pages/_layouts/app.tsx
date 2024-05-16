import { AppWrapper } from '@/components/app-wrapper'
import { ChatBubbleIcon } from '@radix-ui/react-icons'
import { LayoutDashboard, Video } from 'lucide-react'

export function AppLayout() {
  const userItems = [
    {
      label: 'Início',
      pathname: '/app',
      Icon: LayoutDashboard
    },
    {
      label: 'Cursos',
      pathname: '/app/courses',
      Icon: Video
    },
    {
      label: 'Fórum',
      pathname: '/app/forums',
      Icon: ChatBubbleIcon
    }
  ]
  return (
    <AppWrapper items={userItems} allowedRoles={['USER', 'TEACHER', 'ADMIN']} />
  )
}
