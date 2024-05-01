import { getLesson } from '@/api/get-lesson'
import { Loading } from '@/components/ui/loading'
import { queryKeys } from '@/lib/react-query'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import MuxPlayer from '@mux/mux-player-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export function Content() {
  const params = useParams<{ id: string; slug: string }>()
  const [isReady, setIsReady] = useState(false)

  const { data: lesson } = useQuery({
    queryKey: queryKeys.lesson(params.slug ?? ''),
    queryFn: () => getLesson(params.slug ?? '')
  })

  async function onEnded() {
    console.log('finalizar', lesson?.id)
  }

  if (!lesson) {
    return <Loading />
  }

  return (
    <div className="w-[calc(100%-270px)] flex flex-col">
      <div className="relative aspect-video">
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
            <Loading className="w-8 h-8" />
          </div>
        )}
        <MuxPlayer
          autoPlay
          onLoadStart={() => console.log('olá')}
          title={lesson.title}
          onEnded={onEnded}
          playbackId={lesson.playback_id}
          onCanPlay={() => setIsReady(true)}
          className={cn(!isReady && 'hidden')}
        />
      </div>

      <div className="flex flex-col gap-2 p-4">
        <div className="flex justify-between items-center">
          <strong className="text-2xl">{lesson.title}</strong>

          <Button variant="outline">Marcar como vista</Button>
        </div>
      </div>
    </div>
  )
}
