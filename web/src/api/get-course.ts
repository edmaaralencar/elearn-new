import { ICourse, ILesson, IModule } from '@/@types'
import { api } from '@/lib/axios'

type Response = {
  course: ICourse
  lessons: ILesson[]
  modules: IModule[]
}

export async function getCourse(courseId: number) {
  const { data } = await api.get<Response>(`/courses/${courseId}`)

  return data
}
