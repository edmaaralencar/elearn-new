import { api } from '@/lib/axios'

type GetProfileResponse = {
  email: string
  name: string
  role: string
}

export async function getProfile() {
  const { data } = await api.get<GetProfileResponse>('/users/me')

  return data
}
