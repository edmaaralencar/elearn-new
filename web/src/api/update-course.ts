import { api } from '@/lib/axios'

type Params = {
  title: string
  description: string
}

export async function updateCourse(data: Partial<Params> & { id: string }) {
  const { id, ...rest } = data
  return api.patch(`/courses/${id}`, {
    ...rest
  })
}
