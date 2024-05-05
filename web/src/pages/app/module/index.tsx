import { useParams, Navigate } from 'react-router-dom'

import { useChaptersByModule } from '@/api/hooks/use-chapters-by-module'

import { Loading } from '@/components/ui/loading'

export function AppModule() {
  const params = useParams<{ id: string }>()

  const { data, error, isLoading } = useChaptersByModule(params.id ?? '')

  if (error) {
    return <Navigate to="/app/courses" />
  }

  if (!data && !isLoading) {
    return <Navigate to="/app/courses" />
  }

  if (!data) {
    return (
      <div className="w-full h-full grid place-items-center">
        <Loading className="w-8 h-8" />
      </div>
    )
  }

  if (data.chapters[0].lessons.length === 0) {
    return <Navigate to="/app/courses" />
  }

  return (
    <Navigate
      to={`/app/modules/${params.id}/lessons/${data.chapters[0].lessons[0].slug}`}
      replace
    />
  )
}
