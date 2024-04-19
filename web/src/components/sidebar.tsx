import { cn } from '@/lib/utils'
import { LucideIcon, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

type SidebarProps = {
  items: {
    label: string
    pathname: string
    Icon: LucideIcon
  }[]
}

export function Sidebar({ items }: SidebarProps) {
  const { pathname } = useLocation()

  const isOpen = false

  return (
    <div
      className={cn(
        'border-r border-muted hidden h-[calc(100vh-96px)] md:block md:w-[190px] lg:w-[260px]',
        isOpen ? 'block w-72' : 'hidden'
      )}
    >
      <button className="block px-8 pt-6 md:hidden">
        <X className="w-6 h-6 text-white" />
      </button>
      <div className="flex flex-col gap-3 px-4 py-8">
        {items.map(item => (
          <Link
            key={item.label}
            to={item.pathname}
            className={cn(
              'flex flex-row items-center gap-3 rounded-md p-3 transition-colors hover:bg-muted',
              pathname === item.pathname ? 'bg-muted' : 'bg-transparent'
            )}
          >
            <item.Icon
              className={cn(
                'w-5 h-5',
                pathname === item.pathname
                  ? 'text-white'
                  : 'text-muted-foreground'
              )}
            />
            <span
              className={cn(
                'text-sm',
                pathname === item.pathname
                  ? 'text-white font-medium'
                  : 'text-muted-foreground font-normal'
              )}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
