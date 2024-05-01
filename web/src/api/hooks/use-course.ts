import { useQuery } from '@tanstack/react-query'

import { getCourse } from '../get-course'
import { queryKeys } from '@/lib/react-query'

export function useCourse(courseId: string) {
  return useQuery({
    queryKey: queryKeys.course(courseId),
    queryFn: () => getCourse(Number(courseId))
  })
}
