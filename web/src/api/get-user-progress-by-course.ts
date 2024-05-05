import { IUserProgress } from '@/@types'
import { api } from '@/lib/axios'

export async function getUserProgressByCourse(id: string) {
  const response = await api.get<{ progress: IUserProgress[] }>(
    `/progress/${id}`
  )

  return response.data.progress
}
