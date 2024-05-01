import { ICourse } from '@/@types'
import { api } from '@/lib/axios'

type Response = {
  course: ICourse
}

export async function getCourseDetails(courseId: number) {
  const { data } = await api.get<Response>(`/courses/${courseId}/details`)

  return data.course
}
