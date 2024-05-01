import { Section } from '.'
import { Button } from '@/components/ui/button'
import { PlusCircle, Trash } from 'lucide-react'
import { ILesson } from '@/@types'
import { DeleteModal } from '@/components/delete-modal'
import { useMutation } from '@tanstack/react-query'
import { deleteLesson } from '@/api/delete-lesson'
import { toast } from 'sonner'
import { queryClient } from '@/lib/react-query'
import { useParams } from 'react-router-dom'

type LessonsSectionProps = {
  onSelectSection: (section: Section) => void
  initialData: {
    lessons: ILesson[]
  }
}

export function LessonsSection({
  onSelectSection,
  initialData
}: LessonsSectionProps) {
  const params = useParams<{ id: string }>()

  const deleteLessonMutation = useMutation({
    mutationFn: deleteLesson,
    onMutate: () => {
      toast.success('Deletando aula...')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['courses', Number(params.id)]
      })

      toast.success('Aula deletada com sucesso.')
    }
  })

  async function handleDeleteLesson(lesson_id: string) {
    await deleteLessonMutation.mutateAsync(lesson_id)
  }

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

      <div className="flex flex-col gap-5">
        {initialData.lessons.map(item => (
          <div
            className="flex items-center justify-between border bg-muted/30 rounded-md mb-4 text-sm py-2 px-4"
            key={item.id}
          >
            <span className="text-sm">{item.title}</span>

            <div className="">
              <DeleteModal
                title="Você tem certeza que deseja deletar a aula?"
                description="Essa ação não pode ser desfeita e a aula será permanentemente deletado dos nosso servidores."
                onConfirm={() => handleDeleteLesson(String(item.id))}
                isLoading={deleteLessonMutation.isPending}
              >
                <Button size="xs" variant="outline">
                  <Trash className="w-3 h-3" />
                </Button>
              </DeleteModal>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
