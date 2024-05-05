import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/lib/react-query'
import { getUserProgressByCourse } from '../get-user-progress-by-course'

export function useProgressByCourse(courseId: string) {
  return useQuery({
    queryKey: queryKeys.progressByCourse(courseId),
    queryFn: () => getUserProgressByCourse(courseId)
  })
}
