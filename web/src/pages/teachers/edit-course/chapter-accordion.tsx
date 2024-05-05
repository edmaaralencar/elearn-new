import { IChapter, ILesson } from '@/@types'
import { deleteChapter } from '@/api/delete-chapter'
import { reorderList } from '@/api/reorder-list'
import { DeleteModal } from '@/components/delete-modal'
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { VisualizeChapterModal } from '@/components/visualize-chapter-modal'
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

type ChapterAccordionProps = {
  moduleTitle: string
  chapters: IChapter[]
  lessons: ILesson[]
  moduleId: number
}

export function ChapterAccordion({
  moduleTitle,
  chapters: initialChapters,
  lessons,
  moduleId
}: ChapterAccordionProps) {
  const [chapters, setChapters] = useState<IChapter[]>([])
  const params = useParams()
  const queryClient = useQueryClient()

  useEffect(() => {
    setChapters([...initialChapters.sort((a, b) => a.position - b.position)])
  }, [initialChapters])

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

    const items = Array.from(chapters)
    const [reorderedItem] = items.splice(result.source.index, 1)

    items.splice(result.destination.index, 0, reorderedItem)

    const startIndex = Math.min(result.source.index, result.destination.index)
    const endIndex = Math.max(result.source.index, result.destination.index)

    const updatedChapters = items.slice(startIndex, endIndex + 1)

    setChapters(items)

    const bulkUpdateData = updatedChapters.map(chapter => ({
      id: chapter.id,
      position: items.findIndex(item => item.id === chapter.id)
    }))

    await reorderListMutation.mutateAsync({
      list: bulkUpdateData,
      type: 'CHAPTER',
      courseId: Number(params.id)
    })
  }

  const deleteChapterMutation = useMutation({
    mutationFn: deleteChapter,
    onMutate: () => {
      toast.success('Deletando capítulo...')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['courses', Number(params.id)]
      })

      toast.success('Capítulo deletado com sucesso.')
    }
  })

  async function handleDeleteChapter(chapter_id: string) {
    await deleteChapterMutation.mutateAsync(chapter_id)
  }

  return (
    <AccordionItem value={moduleId.toString()}>
      <AccordionTrigger>
        <span className="font-medium">{moduleTitle}</span>
      </AccordionTrigger>
      <AccordionContent>
        <div className="-mb-4 p-4">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="chapters">
              {provided => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="w-full"
                >
                  {chapters.map((chapter, index) => (
                    <Draggable
                      index={index}
                      key={chapter.id}
                      draggableId={String(chapter.id)}
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
                            <span className="text-sm block flex-1">
                              {chapter.name}
                            </span>

                            <div className="flex items-center gap-1">
                              <VisualizeChapterModal
                                chapter={chapter}
                                lessons={lessons.filter(
                                  item => item.chapter_id === chapter.id
                                )}
                              />
                              <DeleteModal
                                title="Você tem certeza que deseja deletar o capítulo?"
                                description="Essa ação não pode ser desfeita e o capítulo será permanentemente deletado dos nosso servidores, bem como todas as vídeos aulas atríbuidas a esse capítulos serão desvinculadas."
                                onConfirm={() =>
                                  handleDeleteChapter(String(chapter.id))
                                }
                                isLoading={deleteChapterMutation.isPending}
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
        {/* <div className="p-2 flex flex-col gap-1">
                  {initialData.chapters
                    .filter(chapter => chapter.module_id === module.id)
                    .map(chapter => (
                      <Link
                        className="flex p-2 items-center justify-between hover:bg-muted/80 transition-all rounded-md"
                        to="/"
                        key={chapter.id}
                      >
                        <div className="flex gap-2 items-center">
                          <Video className="w-4 h-4" />
                          <h4>{chapter.name}</h4>
                        </div>
                      </Link>
                    ))}
                </div> */}
      </AccordionContent>
    </AccordionItem>
  )
}
