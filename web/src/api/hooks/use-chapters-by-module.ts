import { useQuery } from '@tanstack/react-query'
import { getChaptersByModule } from '../get-chapters-by-module'
import { queryKeys } from '@/lib/react-query'

export function useChaptersByModule(moduleId: string) {
  return useQuery({
    queryFn: () => getChaptersByModule(moduleId),
    queryKey: queryKeys.chaptersByModule(moduleId)
  })
}
