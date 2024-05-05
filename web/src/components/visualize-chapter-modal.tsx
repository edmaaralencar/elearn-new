/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Expand, Grip } from 'lucide-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from './ui/form'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useParams } from 'react-router-dom'
import { createChapter } from '@/api/create-chapter'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ComponentRef, useEffect, useRef, useState } from 'react'
import { IChapter, ILesson } from '@/@types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult
} from '@hello-pangea/dnd'
import { cn } from '@/lib/utils'

const createChapterFormSchema = z.object({
  name: z.string().min(1, { message: 'Título do curso obrigatório.' })
})

type FormInput = z.infer<typeof createChapterFormSchema>

type VisualizeChapterModalProps = {
  lessons: ILesson[]
  chapter: IChapter
}

export function VisualizeChapterModal({
  chapter,
  lessons: initialLessons
}: VisualizeChapterModalProps) {
  const params = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const modalRef = useRef<ComponentRef<'div'>>(null)

  const [isOpen, setIsOpen] = useState(false)
  const [lessons, setLessons] = useState(initialLessons)

  const form = useForm<FormInput>({
    resolver: zodResolver(createChapterFormSchema),
    defaultValues: {
      name: chapter.name ?? ''
    }
  })

  useEffect(() => {
    setLessons(initialLessons)
  }, [initialLessons])

  const createChapterMutation = useMutation({
    mutationFn: createChapter,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['courses', Number(params.id)]
      })
    }
  })

  async function onSubmit(values: FormInput) {
    try {
      await createChapterMutation.mutateAsync({
        course_id: Number(params.id),
        name: values.name,
        module_id: chapter.module_id
      })

      toast.success('Capítulo criado com sucesso.')

      setIsOpen(false)
    } catch (error) {
      toast.error('Ocorreu um erro.')
    }
  }

  function onDragEnd(result: DropResult) {
    // dropped outside the list
    if (!result.destination) {
      return
    }

    const items = Array.from(lessons)
    const [reorderedItem] = items.splice(result.source.index, 1)

    items.splice(result.destination.index, 0, reorderedItem)

    const startIndex = Math.min(result.source.index, result.destination.index)
    const endIndex = Math.max(result.source.index, result.destination.index)

    const updatedChapters = items.slice(startIndex, endIndex + 1)

    setLessons(items)

    const bulkUpdateData = updatedChapters.map(chapter => ({
      id: chapter.id,
      position: items.findIndex(item => item.id === chapter.id)
    }))

    // onReorder(bulkUpdateData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="xs">
          <Expand className="w-3 h-3" />
        </Button>
      </DialogTrigger>
      <DialogContent ref={modalRef} className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Informações do capítulo</DialogTitle>
          <DialogDescription>
            Atualize as informações do capítulo ou mude as ordens da aula para
            ficar da forma que deseja.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="chapter" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger className="w-full" value="chapter">
              Capítulo
            </TabsTrigger>
            <TabsTrigger className="w-full" value="lessons">
              Aulas
            </TabsTrigger>
          </TabsList>
          <TabsContent value="chapter">
            <Form {...form}>
              <form
                className="space-y-5 mt-6"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Título" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button isLoading={form.formState.isSubmitting} type="submit">
                    Criar
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="lessons">
            {lessons.length === 0 && (
              <span className="text-center block text-muted-foreground mt-8">
                Nenhuma aula criada.
              </span>
            )}

            {lessons.length > 0 && (
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="lessons">
                  {(provided, snapshot: any) => {
                    const offset =
                      modalRef.current?.getBoundingClientRect().top ?? 0

                    return (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="w-full mt-6"
                      >
                        {lessons.map((chapter, index) => (
                          <Draggable
                            index={index}
                            key={chapter.id}
                            draggableId={String(chapter.id)}
                          >
                            {(provided: any) => (
                              <div
                                className={cn(
                                  'flex items-center gap-x-2 border bg-muted/30 rounded-md mb-5 text-sm'
                                )}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  ...provided.draggableProps.style,
                                  left: 'auto !important',
                                  top: snapshot.isDraggingOver
                                    ? provided?.draggableProps?.style?.top -
                                      offset
                                    : 'auto !important'
                                }}
                              >
                                <div
                                  className={cn(
                                    'px-2 py-3 border-r hover:bg-primary rounded-l-md transition'
                                  )}
                                  {...provided.dragHandleProps}
                                >
                                  <Grip className="w-5 h-5" />
                                </div>

                                <span className="text-sm">{chapter.title}</span>

                                {/* <div className="flex items-center gap-1 w-full justify-end pr-2">
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
                            </div> */}
                              </div>
                            )}
                          </Draggable>
                        ))}

                        {provided.placeholder}
                      </div>
                    )
                  }}
                </Droppable>
              </DragDropContext>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
