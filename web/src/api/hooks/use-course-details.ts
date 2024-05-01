import { useQuery } from '@tanstack/react-query'

import { getCourseDetails } from '../get-course-details'
import { queryKeys } from '@/lib/react-query'

export function useCourseDetails(courseId: string) {
  return useQuery({
    queryKey: queryKeys.courseDetails(courseId),
    queryFn: () => getCourseDetails(Number(courseId))
  })
}
