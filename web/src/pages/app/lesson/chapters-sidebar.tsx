import { useChaptersByModule } from '@/api/hooks/use-chapters-by-module'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Loading } from '@/components/ui/loading'
import { Video } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

export function ChaptersSidebar() {
  const params = useParams<{ id: string; lesson: string }>()

  const { data } = useChaptersByModule(params.id ?? '')

  if (!data) {
    return <Loading />
  }

  return (
    <div className="w-[270px] p-4 fixed top-20 bottom-0 overflow-y-auto right-0">
      <h2 className="text-lg font-semibold">Capítulos</h2>

      {!data ? (
        <Loading />
      ) : (
        <Accordion
          type="single"
          collapsible
          className="w-full flex flex-col gap-4 mt-6"
        >
          {[
            ...data.chapters,
            ...data.chapters,
            ...data.chapters,
            ...data.chapters
          ].map(item => (
            <AccordionItem key={item.id} value={item.id.toString()}>
              <AccordionTrigger className="">
                <div className="w-8 h-8 grid place-items-center text-xs bg-muted/80 rounded-full">
                  {item.position + 1}
                </div>
                <div className="flex flex-col items-start gap-1">
                  <span className="text-sm">{item.name}</span>
                  <small className="text-muted-foreground text-xs">
                    {item.lessons.length} aula(s)
                  </small>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-2 flex flex-col gap-1">
                  {item.lessons.map(lesson => (
                    <Link
                      className="flex p-2 items-center justify-between hover:bg-muted/80 transition-all rounded-md"
                      to={`/app/modules/${params.id}/lessons/${lesson.slug}`}
                      key={lesson.id + lesson.slug}
                    >
                      <div className="flex gap-2 items-center">
                        <Video className="w-4 h-4" />
                        <h4>{lesson.title}</h4>
                      </div>

                      <span className="text-sm text-muted-foreground">
                        {/* 00:01:43 */}
                        {lesson.duration}
                      </span>
                    </Link>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  )
}
