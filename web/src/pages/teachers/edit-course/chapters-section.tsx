import { CreateChapterModal } from '@/components/create-chapter-modal'
import { IChapter, ILesson, IModule } from '@/@types'
import { Accordion } from '@/components/ui/accordion'
import { ChapterAccordion } from './chapter-accordion'

type ChaptersSectionProps = {
  initialData: {
    chapters: IChapter[]
    lessons: ILesson[]
    modules: IModule[]
  }
}

export function ChaptersSection({ initialData }: ChaptersSectionProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-xl font-medium">Capítulos</h2>
          <span className="text-muted-foreground text-sm">
            Os capítulos são responsáveis pelo agrupamento de várias aulas de um
            módulo.
          </span>
        </div>

        <CreateChapterModal modules={initialData.modules} />
      </div>

      <div className="space-y-5 flex flex-col items-end">
        <Accordion
          type="single"
          collapsible
          className="w-full flex flex-col gap-4"
        >
          {initialData.modules.map(module => (
            <ChapterAccordion
              moduleTitle={module.title}
              chapters={initialData.chapters.filter(
                chapter => chapter.module_id === module.id
              )}
              lessons={initialData.lessons}
              key={module.id}
              moduleId={module.id}
            />
          ))}
        </Accordion>
      </div>
    </div>
  )
}
