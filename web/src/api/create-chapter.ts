import { api } from '@/lib/axios'

type Params = {
  name: string
  course_id: number
  module_id: number
}

export async function createChapter({ course_id, module_id, name }: Params) {
  return api.post('/chapters', {
    name,
    course_id,
    module_id
  })
}
