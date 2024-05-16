import { AppWrapper } from '@/components/app-wrapper'
import { CircleDollarSign, Home, User, Video } from 'lucide-react'

export function AdminLayout() {
  const userItems = [
    {
      label: 'Início',
      pathname: '/admin',
      Icon: Home
    },
    {
      label: 'Cursos',
      pathname: '/admin/courses',
      Icon: Video
    },
    {
      label: 'Professores',
      pathname: '/admin/teachers',
      Icon: User
    },
    {
      label: 'Pagamentos',
      pathname: '/admin/payments',
      Icon: CircleDollarSign
    }
  ]

  return <AppWrapper items={userItems} allowedRoles={['ADMIN']} />
}
