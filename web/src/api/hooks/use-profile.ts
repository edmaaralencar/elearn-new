import { useQuery } from '@tanstack/react-query'

import { getProfile } from '../get-profile'
import { queryKeys } from '@/lib/react-query'

export function useProfile() {
  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: getProfile
  })
}
