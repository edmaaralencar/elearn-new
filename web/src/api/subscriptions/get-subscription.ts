import { api } from '@/lib/axios'

type Response = {
  id: string
  price: number
  name: string
  description: string
  image: string
  features: string[]
}

export async function getSubscription() {
  const { data } = await api.get<Response>('/subscription')

  return data
}
