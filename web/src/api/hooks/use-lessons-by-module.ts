import { useQuery } from '@tanstack/react-query'
import { getLessonsByModule } from '../get-lessons-by-module'
import { queryKeys } from '@/lib/react-query'

export function useLessonsByModule(moduleId: string) {
  return useQuery({
    queryFn: () => getLessonsByModule(moduleId),
    queryKey: queryKeys.lessonsByModule(moduleId)
  })
}
