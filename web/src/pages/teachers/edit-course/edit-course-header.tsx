import { IChapter, ICourse, ILesson } from '@/@types'
import { Button } from '@/components/ui/button'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/ui/hover-card'

type EditCourseHeaderProps = {
  course: ICourse
  chapters: IChapter[]
  lessons: ILesson[]
}

export function EditCourseHeader({
  course,
  chapters,
  lessons
}: EditCourseHeaderProps) {
  const fields = [
    course.coverImage,
    course.title,
    course.description,
    chapters.length > 0,
    lessons.length > 0
  ]

  const completedFields = fields.filter(Boolean)

  return (
    <header className="flex items-end justify-between">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Criação de curso</h1>
        <span className="text-muted-foreground text-sm">
          Seções completadas ({completedFields.length}/{fields.length})
        </span>
      </div>

      {course.is_published ? (
        <Button variant="outline">Cancelar publicação</Button>
      ) : (
        <>
          {completedFields.length !== fields.length ? (
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="outline">Publicar</Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="flex justify-between space-x-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">
                      Publicação desativada
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Para conseguir publicar o curso, é necessário preencher
                      todos os campos.
                    </p>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          ) : (
            <Button variant="outline">Publicar</Button>
          )}
        </>
      )}
    </header>
  )
}
