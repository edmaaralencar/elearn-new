import { ILesson } from '@/@types'
import { deleteLesson } from '@/api/delete-lesson'
import { reorderList } from '@/api/reorder-list'
import { DeleteModal } from '@/components/delete-modal'
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { queryKeys } from '@/lib/react-query'
import { cn } from '@/lib/utils'
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable
} from '@hello-pangea/dnd'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Grip, Trash } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'

type LessonAccordionProps = {
  moduleTitle: string
  lessons: ILesson[]
  moduleId: number
}

export function LessonAccordion({
  moduleTitle,
  lessons: initialLessons,
  moduleId
}: LessonAccordionProps) {
  const [lessons, setLessons] = useState<ILesson[]>([])
  const params = useParams()
  const queryClient = useQueryClient()

  useEffect(() => {
    setLessons([...initialLessons.sort((a, b) => a.position - b.position)])
  }, [initialLessons])

  const reorderListMutation = useMutation({
    mutationFn: reorderList,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['courses', Number(params.id)]
      })
    }
  })

  async function onDragEnd(result: DropResult) {
    if (!result.destination) {
      return
    }

    const items = Array.from(lessons)
    const [reorderedItem] = items.splice(result.source.index, 1)

    items.splice(result.destination.index, 0, reorderedItem)

    const startIndex = Math.min(result.source.index, result.destination.index)
    const endIndex = Math.max(result.source.index, result.destination.index)

    const updatedLessons = items.slice(startIndex, endIndex + 1)

    setLessons(items)

    const bulkUpdateData = updatedLessons.map(lesson => ({
      id: lesson.id,
      position: items.findIndex(item => item.id === lesson.id)
    }))

    await reorderListMutation.mutateAsync({
      list: bulkUpdateData,
      type: 'LESSON',
      courseId: Number(params.id)
    })
  }

  const deleteLessonMutation = useMutation({
    mutationFn: deleteLesson,
    onMutate: () => {
      toast.success('Deletando aula...')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.course(String(params.id))
      })

      toast.success('Aula deletada com sucesso.')
    }
  })

  async function handleDeleteLesson(lesson_id: string) {
    await deleteLessonMutation.mutateAsync(lesson_id)
  }

  return (
    <AccordionItem value={moduleId.toString()}>
      <AccordionTrigger>
        <span className="font-medium text-sm">Módulo: {moduleTitle}</span>
      </AccordionTrigger>
      <AccordionContent>
        <div className="-mb-4 p-4">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId={`lessons-${moduleTitle}`}>
              {provided => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="w-full"
                >
                  {lessons.map((lesson, index) => (
                    <Draggable
                      index={index}
                      key={lesson.id}
                      draggableId={String(lesson.id)}
                    >
                      {provided => (
                        <div
                          className={cn(
                            'flex items-center gap-x-2 border bg-muted/30 rounded-md mb-4 text-sm'
                          )}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          <div
                            className={cn(
                              'px-2 py-3 border-r hover:bg-primary rounded-l-md transition'
                            )}
                            {...provided.dragHandleProps}
                          >
                            <Grip className="w-5 h-5" />
                          </div>

                          <div className="flex justify-between items-center w-full pr-2">
                            <span className="text-xs block flex-1">
                              {lesson.title}
                            </span>

                            <div className="flex items-center gap-1">
                              <DeleteModal
                                title="Você tem certeza que deseja deletar o capítulo?"
                                description="Essa ação não pode ser desfeita e o capítulo será permanentemente deletado dos nosso servidores, bem como todas as vídeos aulas atríbuidas a esse capítulos serão desvinculadas."
                                onConfirm={() =>
                                  handleDeleteLesson(String(lesson.id))
                                }
                                isLoading={deleteLessonMutation.isPending}
                              >
                                <Button size="xs" variant="outline">
                                  <Trash className="w-3 h-3" />
                                </Button>
                              </DeleteModal>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
