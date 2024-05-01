import { api } from '@/lib/axios'

type Response = {
  courses: {
    title: string
    description: string | null
    id: number
    coverImage: string | null
    created_by: number
    is_published: boolean | null
    chapters: number
  }[]
}

export async function getCoursesByTeacher() {
  const { data } = await api.get<Response>(`/teachers/courses`)

  return data
}
