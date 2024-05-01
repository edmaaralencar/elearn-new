import { api } from '@/lib/axios'

type Response = {
  chapters: {
    id: number
    name: string
    slug: string
    course_id: number
    module_id: number
    position: number
    lessons: {
      slug: string
      id: number
      title: string
      duration: number
    }[]
  }[]
}

export async function getChaptersByModule(moduleId: string) {
  const { data } = await api.get<Response>(`/chapters/modules/${moduleId}`)

  return data
}
