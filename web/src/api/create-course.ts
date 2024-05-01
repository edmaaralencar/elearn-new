import { api } from '@/lib/axios'

type CreateCourseParams = {
  title: string
  type: 'mini-course' | 'formation'
}

export async function createCourse({ title, type }: CreateCourseParams) {
  return api.post('/courses', {
    title,
    type
  })
}
