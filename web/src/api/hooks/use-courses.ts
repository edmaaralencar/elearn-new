import { useQuery } from '@tanstack/react-query'

import { Params, getCourses } from '../get-courses'
import { queryKeys } from '@/lib/react-query'

export function useCourses({ type, technology }: Params) {
  return useQuery({
    queryKey: queryKeys.courses({ type, technology }),
    queryFn: () =>
      getCourses({
        type,
        technology
      })
  })
}
