import { getLesson } from '@/api/get-lesson'
import { Loading } from '@/components/ui/loading'
import { queryKeys } from '@/lib/react-query'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import MuxPlayer from '@mux/mux-player-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useProgressByCourse } from '@/api/hooks/use-progress-by-course'
import { saveUserProgress } from '@/api/save-user-progress'
import { toast } from 'sonner'

export function Content() {
  const params = useParams<{ id: string; slug: string }>()
  const [isReady, setIsReady] = useState(false)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: lessonInfo } = useQuery({
    queryKey: queryKeys.lesson(params.slug ?? ''),
    queryFn: () => getLesson(params.slug ?? '')
  })

  const { data: progress } = useProgressByCourse(params.id ?? '')

  const updateProgressMutation = useMutation({
    mutationFn: saveUserProgress,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['progress', params.id]
      })
    }
  })

  const isCurrentClassFinished = (progress ?? []).find(
    item => item.lesson_id === lessonInfo?.lesson.id
  )?.is_completed

  async function onEnded() {
    if (lessonInfo?.nextLesson) {
      toast.success('Aula finalizada com sucesso.', {
        description: 'Você será redirecionado para a próxima aula'
      })

      if (isCurrentClassFinished) {
        navigate(`/app/modules/${params.id}/lessons/${lessonInfo.nextLesson}`)
        return
      } else {
        await updateProgressMutation.mutateAsync({
          is_completed: true,
          lesson_id: Number(lessonInfo?.lesson.id)
        })
        navigate(`/app/modules/${params.id}/lessons/${lessonInfo.nextLesson}`)
      }
    } else {
      await updateProgressMutation.mutateAsync({
        is_completed: true,
        lesson_id: Number(lessonInfo?.lesson.id)
      })

      toast.success('Curso finalizado com sucesso.')
    }
  }

  async function onUpdateProgress(is_completed: boolean) {
    await updateProgressMutation.mutateAsync({
      lesson_id: Number(lessonInfo?.lesson.id),
      is_completed
    })

    toast.success('Progresso da aual atualizado com sucesso.')
  }

  if (!lessonInfo || !progress) {
    return <Loading />
  }

  return (
    <div className="flex flex-col w-full">
      <div className="relative h-[250px] sm:h-[300px] md:h-[400px] lg:h-[550px]">
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
            <Loading className="w-8 h-8" />
          </div>
        )}
        <MuxPlayer
          autoPlay
          onLoadStart={() => console.log('olá')}
          title={lessonInfo.lesson.title}
          onEnded={onEnded}
          playbackId={lessonInfo.lesson.playback_id}
          onCanPlay={() => setIsReady(true)}
          className={cn('h-full w-full', !isReady && 'hidden')}
        />
      </div>

      <div className="flex flex-col gap-2 p-4">
        <div className="flex justify-between items-center">
          <strong className="text-2xl">{lessonInfo.lesson.title}</strong>

          {isCurrentClassFinished ? (
            <Button
              isLoading={updateProgressMutation.isPending}
              onClick={() => onUpdateProgress(false)}
              variant="outline"
            >
              Marcar como não vista
            </Button>
          ) : (
            <Button
              isLoading={updateProgressMutation.isPending}
              onClick={() => onUpdateProgress(true)}
              variant="outline"
            >
              Marcar como vista
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
