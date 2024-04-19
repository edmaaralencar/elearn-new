'use client'

import {
  DollarSign,
  Key,
  LayoutDashboard,
  LucideIcon,
  User
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Section } from '.'

const options: { label: string; section: Section; icon: LucideIcon }[] = [
  {
    label: 'Geral',
    section: 'general',
    icon: LayoutDashboard
  },
  {
    label: 'Capitulos',
    section: 'chapters',
    icon: DollarSign
  },
  {
    label: 'Preço',
    section: 'pricing',
    icon: User
  },
  {
    label: 'Imagens',
    section: 'images',
    icon: Key
  }
]

type CreateCourseSidebarProps = {
  selectedSection: Section
  onSelectSection: (value: Section) => void
}

export function CreateCourseSidebar({
  onSelectSection,
  selectedSection
}: CreateCourseSidebarProps) {
  return (
    <div className="border border-muted w-full max-w-sm rounded-md flex flex-col gap-1 py-2">
      {options.map(item => (
        <button
          className={cn(
            'flex gap-2 w-full py-3 px-6 hover:bg-muted transition-colors items-center border-l-2 text-sm border-muted',
            selectedSection === item.section &&
              'bg-muted font-bold border-primary'
          )}
          onClick={() => onSelectSection(item.section)}
          key={item.label}
        >
          <item.icon className="w-4 h-4" />
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  )
}
