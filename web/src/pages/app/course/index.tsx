import { getModulesByCourse } from '@/api/get-modules-by-course'
import { useCourseDetails } from '@/api/hooks/use-course-details'
import { Loading } from '@/components/ui/loading'
import { queryKeys } from '@/lib/react-query'
import { formatSeconds } from '@/utils/format-seconds'
import { useQuery } from '@tanstack/react-query'
import { Video } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

export function AppCourse() {
  const params = useParams<{ id: string }>()

  const { data: course } = useCourseDetails(params.id ?? '')
  const { data: modules } = useQuery({
    queryFn: () => getModulesByCourse(params.id ?? ''),
    queryKey: queryKeys.modulesByCourse(params.id ?? '')
  })

  if (!course || !modules) {
    return <Loading />
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold">{course.title}</h1>
        <span className="text-sm text-muted-foreground">
          {course.description}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-xl font-bold">Módulos</h2>

        <div className="flex flex-col gap-4">
          {modules.map(item => (
            <Link
              key={item.title}
              to={`/app/modules/${item.id}`}
              className="bg-muted/30 rounded-md p-4 flex gap-4 items-start"
            >
              <div className="border border-border p-3 rounded-full">
                <Video className="w-6 h-6" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <strong className="text-lg font-semibold">
                    {item.title}
                  </strong>

                  <span className="py-1 px-2 text-xs bg-primary/50 rounded-full">
                    {item.type === 'module' ? 'Módulo' : 'Quiz'}
                  </span>
                  <span className="py-1 px-2 text-xs bg-primary/50 rounded-full">
                    {item.lessons_count} aulas
                  </span>
                  <span className="py-1 px-2 text-xs bg-primary/50 rounded-full">
                    {formatSeconds(item.total_duration)} horas
                  </span>
                </div>
                <p className="text-muted-foreground text-sm">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
