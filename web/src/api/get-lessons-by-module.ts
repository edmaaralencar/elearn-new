import { api } from '@/lib/axios'

type Response = {
  lessons: {
    slug: string
    id: number
    title: string
    duration: number
  }[]
}

export async function getLessonsByModule(moduleId: string) {
  const { data } = await api.get<Response>(`/lessons/modules/${moduleId}`)

  return data.lessons
}
