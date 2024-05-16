import { Grip, Trash } from 'lucide-react'
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from '@hello-pangea/dnd'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { DeleteModal } from '@/components/delete-modal'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { IModule } from '@/@types'
import { reorderList } from '@/api/reorder-list'
import { CreateModuleModal } from '@/components/create-module-modal'
import { deleteModule } from '@/api/delete-module'

type ModulesSectionProps = {
  initialData: {
    modules: IModule[]
  }
}

export function ModulesSection({ initialData }: ModulesSectionProps) {
  const [modules, setModules] = useState<IModule[]>([])
  const params = useParams<{ id: string }>()
  const queryClient = useQueryClient()

  useEffect(() => {
    setModules([...initialData.modules.sort((a, b) => a.position - b.position)])
  }, [initialData.modules])

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

    const items = Array.from(modules)
    const [reorderedItem] = items.splice(result.source.index, 1)

    items.splice(result.destination.index, 0, reorderedItem)

    const startIndex = Math.min(result.source.index, result.destination.index)
    const endIndex = Math.max(result.source.index, result.destination.index)

    const updatedModules = items.slice(startIndex, endIndex + 1)

    setModules(items)

    const bulkUpdateData = updatedModules.map(module => ({
      id: module.id,
      position: items.findIndex(item => item.id === module.id)
    }))

    await reorderListMutation.mutateAsync({
      list: bulkUpdateData,
      type: 'MODULE',
      courseId: Number(params.id)
    })
  }

  const deleteModuleMutation = useMutation({
    mutationFn: deleteModule,
    onMutate: () => {
      toast.success('Deletando módulo...')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['courses', Number(params.id)]
      })

      toast.success('Módulo deletado com sucesso.')
    }
  })

  async function handleDeleteModule(module_id: string) {
    await deleteModuleMutation.mutateAsync(module_id)
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-xl font-medium">Módulos</h2>
          <span className="text-muted-foreground text-sm">
            Os módulos são responsáveis pelo agrupamento de aulas de um curso.
          </span>
        </div>

        <CreateModuleModal />
      </div>

      <div className="space-y-5 flex flex-col items-end">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="modules">
            {provided => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="w-full -mb-4"
              >
                {modules.map((module, index) => (
                  <Draggable
                    index={index}
                    key={module.id}
                    draggableId={String(module.id)}
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
                            {module.title}
                          </span>

                          <div className="flex items-center gap-1">
                            <DeleteModal
                              title="Você tem certeza que deseja deletar o módulo?"
                              description="Essa ação não pode ser desfeita e o módulo será permanentemente deletado dos nosso servidores, bem como todas os capítulos atríbuidas a esse módulo serão desvinculados."
                              onConfirm={() =>
                                handleDeleteModule(String(module.id))
                              }
                              isLoading={deleteModuleMutation.isPending}
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
    </div>
  )
}
