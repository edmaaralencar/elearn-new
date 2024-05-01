import { api } from '@/lib/axios'

type Params = {
  title: string
  description: string
  course_id: string
  type: 'module' | 'quiz'
}

export async function createModule({
  title,
  type,
  course_id,
  description
}: Params) {
  return api.post('/modules', {
    title,
    type,
    course_id: Number(course_id),
    description
  })
}
