import { IModule } from '@/@types'
import { api } from '@/lib/axios'

type Response = {
  modules: (IModule & {
    lessons_count: number
    total_duration: number
  })[]
}

export async function getModulesByCourse(courseId: string) {
  const { data } = await api.get<Response>(`/modules/courses/${courseId}`)

  return data.modules
}
