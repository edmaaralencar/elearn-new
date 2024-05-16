import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/lib/react-query'
import { getSubscription } from '../subscriptions/get-subscription'

export function useSubscription() {
  return useQuery({
    queryKey: queryKeys.subscription,
    queryFn: () => getSubscription()
  })
}
