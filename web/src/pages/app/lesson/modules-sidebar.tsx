import { useLessonsByModule } from '@/api/hooks/use-lessons-by-module'
import { useProgressByCourse } from '@/api/hooks/use-progress-by-course'
import { Loading } from '@/components/ui/loading'
import { cn } from '@/lib/utils'
import { formatSeconds } from '@/utils/format-seconds'
import { Video } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

export function ModulesSidebar() {
  const params = useParams<{ id: string; lesson: string }>()

  const { data: lessons } = useLessonsByModule(params.id ?? '')
  const { data: progress } = useProgressByCourse(params.id ?? '')

  if (!lessons) {
    return <Loading />
  }

  return (
    <div className="w-[270px] p-4 bg-background">
      <div className="sticky top-5">
        <h2 className="text-lg font-semibold">Aulas</h2>

        {!lessons ? (
          <Loading />
        ) : (
          <div className="w-full flex flex-col gap-4 mt-3">
            {lessons.map(lesson => (
              <Link
                className="flex p-2 items-center justify-between hover:bg-muted/80 transition-all rounded-md"
                to={`/app/modules/${params.id}/lessons/${lesson.slug}`}
                key={lesson.id + lesson.slug}
              >
                <div
                  className={cn(
                    'flex gap-2 items-center',
                    progress?.find(item => item.lesson_id === lesson.id)
                      ?.is_completed
                      ? 'text-emerald-700'
                      : 'text-white'
                  )}
                >
                  <Video className="w-4 h-4" />
                  <h4>{lesson.title}</h4>
                </div>

                <span
                  className={cn(
                    'text-sm text-muted-foreground',
                    progress?.find(item => item.lesson_id === lesson.id)
                      ?.is_completed
                      ? 'text-emerald-800'
                      : 'text-muted-foreground'
                  )}
                >
                  {formatSeconds(lesson.duration)}
                </span>
              </Link>
            ))}
          </div>
          // <Accordion
          //   type="single"
          //   collapsible
          //   className="w-full flex flex-col gap-4 mt-6"
          // >
          //   {data.chapters.map(item => (
          //     <AccordionItem key={item.id} value={item.id.toString()}>
          //       <AccordionTrigger className="">
          //         <div className="w-8 h-8 grid place-items-center text-xs bg-muted/80 rounded-full">
          //           {item.position + 1}
          //         </div>
          //         <div className="flex flex-col items-start gap-1">
          //           <span className="text-sm">{item.name}</span>
          //           <small className="text-muted-foreground text-xs">
          //             {item.lessons.length} aula(s)
          //           </small>
          //         </div>
          //       </AccordionTrigger>
          //       <AccordionContent>
          //         <div className="p-2 flex flex-col gap-1">
          //           {item.lessons.map(lesson => (
          //             <Link
          //               className="flex p-2 items-center justify-between hover:bg-muted/80 transition-all rounded-md"
          //               to={`/app/modules/${params.id}/lessons/${lesson.slug}`}
          //               key={lesson.id + lesson.slug}
          //             >
          //               <div
          //                 className={cn(
          //                   'flex gap-2 items-center',
          //                   progress?.find(item => item.lesson_id === lesson.id)
          //                     ?.is_completed
          //                     ? 'text-emerald-700'
          //                     : 'text-white'
          //                 )}
          //               >
          //                 <Video className="w-4 h-4" />
          //                 <h4>{lesson.title}</h4>
          //               </div>

          //               <span
          //                 className={cn(
          //                   'text-sm text-muted-foreground',
          //                   progress?.find(item => item.lesson_id === lesson.id)
          //                     ?.is_completed
          //                     ? 'text-emerald-800'
          //                     : 'text-muted-foreground'
          //                 )}
          //               >
          //                 {formatSeconds(lesson.duration)}
          //               </span>
          //             </Link>
          //           ))}
          //         </div>
          //       </AccordionContent>
          //     </AccordionItem>
          //   ))}
          // </Accordion>
        )}
      </div>
    </div>
  )
}
