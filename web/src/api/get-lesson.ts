import { ILesson } from '@/@types'
import { api } from '@/lib/axios'

type Response = {
  lesson: ILesson
  nextLesson: string | null
}

export async function getLesson(slug: string) {
  const { data } = await api.get<Response>(`/lessons/${slug}`)

  return {
    lesson: data.lesson,
    nextLesson: data.nextLesson
  }
}
