import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useDragAndDrop } from '@formkit/drag-and-drop/react'
import { Grip } from 'lucide-react'
import {
  DragDropContext,
  Droppable,
  Draggable,
  DraggableStyle,
  DropResult
} from '@hello-pangea/dnd'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const saveGeneralDataFormSchema = z.object({
  title: z.string().min(1, { message: 'Título é obrigatório' }),
  description: z.string().min(1, { message: 'Descrição é obrigatório' })
})

const getItems = (count: number) =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k}`,
    content: `item ${k}`
  }))

const reorder = <TList extends unknown[]>(
  list: TList,
  startIndex: number,
  endIndex: number
): TList => {
  const result = Array.from(list) as TList
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

const grid = 8

const getItemStyle = (
  isDragging: boolean,
  draggableStyle: DraggableStyle = {}
) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none' as const,
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'red',

  // styles we need to apply on draggables
  ...draggableStyle
})

type FormInput = z.infer<typeof saveGeneralDataFormSchema>

export function ChaptersSection() {
  const form = useForm<FormInput>({
    resolver: zodResolver(saveGeneralDataFormSchema)
  })
  const [items, setItems] = useState(getItems(10))

  const [parent, tapes] = useDragAndDrop<HTMLDivElement, string>(
    [
      'Depeche Mode',
      'Duran Duran',
      'Pet Shop Boys',
      'Kraftwerk',
      'Tears for Fears',
      'Spandau Ballet'
    ],
    {
      dragHandle: '.drag-handle'
    }
  )

  async function onSubmit(values: FormInput) {
    console.log(values)
  }

  function onDragEnd(result: DropResult) {
    // dropped outside the list
    if (!result.destination) {
      return
    }

    const updatedItems = reorder(
      items,
      result.source.index,
      result.destination.index
    )

    setItems(updatedItems)
  }

  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-xl font-medium">Capítulos</h2>

      <div className="space-y-5 flex flex-col items-end">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {droppableProvided => (
              <div ref={droppableProvided.innerRef} className={cn('w-full')}>
                {items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(draggableProvided, draggableSnapshot) => (
                      <div
                        ref={draggableProvided.innerRef}
                        {...draggableProvided.draggableProps}
                        {...draggableProvided.dragHandleProps}
                        className={cn(
                          'w-full bg-muted/30 rounded-md flex gap-3 items-center overflow-hidden'
                        )}
                        style={{
                          // padding: grid * 2,
                          margin: `0 0 ${grid}px 0`,
                          userSelect: 'none' as const,
                          ...draggableProvided.draggableProps.style,
                          backgroundColor: draggableSnapshot.isDragging
                            ? 'hsl(var(--primary))'
                            : 'hsl(var(--muted) / 0.3)'
                        }}
                      >
                        <div className="p-4 border-r border-background drag-handle hover:bg-primary transition-colors">
                          <Grip className="w-4 h-4" />
                        </div>
                        <span className="text-sm block">{item.content}</span>
                      </div>
                    )}
                  </Draggable>
                ))}
                {droppableProvided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        {/* <div className="w-full flex flex-col gap-4" ref={parent}>
          {tapes.map(tape => (
            <div
              className="w-full bg-muted/30 rounded-md flex gap-3 items-center overflow-hidden"
              data-label={tape}
              key={tape}
            >
              <button className="p-3 border-r border-background drag-handle hover:bg-primary transition-colors">
                <Grip className="w-4 h-4" />
              </button>
              <span className="text-sm block">{tape}</span>
            </div>
          ))}
        </div> */}
        <Button isLoading={form.formState.isSubmitting} type="submit">
          Salvar
        </Button>
      </div>

      {/* <Form {...form}>
        <form
          className="space-y-5 flex flex-col items-end"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          
        </form>
      </Form> */}
    </div>
  )
}
