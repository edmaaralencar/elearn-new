import { ICourse } from '@/@types'
import { api } from '@/lib/axios'

type Response = {
  courses: ICourse[]
}

export type Params = {
  type: 'formation' | 'mini-course' | 'all'
  technology: string | 'all'
}

export async function getCourses({ type, technology }: Params) {
  const { data } = await api.get<Response>(
    `/courses?type=${type}&technology=${technology}`
  )

  return data
}
