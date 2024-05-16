import { PlusCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Accordion } from '@/components/ui/accordion'

import { ILesson, IModule } from '@/@types'

import { Section } from '.'
import { LessonAccordion } from './lesson-accordion'

type LessonsSectionProps = {
  onSelectSection: (section: Section) => void
  initialData: {
    lessons: ILesson[]
    modules: IModule[]
  }
}

export function LessonsSection({
  onSelectSection,
  initialData
}: LessonsSectionProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">Todas as Aulas</h2>

        <Button
          size="sm"
          variant="outline"
          className="gap-2"
          onClick={() => onSelectSection('create-lesson')}
        >
          <PlusCircle className="w-4 h-4" />
          Nova Aula
        </Button>
      </div>

      <div className="space-y-5 flex flex-col items-end">
        <Accordion
          type="single"
          collapsible
          className="w-full flex flex-col gap-4"
        >
          {initialData.modules.map(module => (
            <LessonAccordion
              moduleTitle={module.title}
              lessons={initialData.lessons.filter(
                item => item.module_id === module.id
              )}
              key={module.id}
              moduleId={module.id}
            />
          ))}
        </Accordion>
      </div>
    </div>
  )
}
