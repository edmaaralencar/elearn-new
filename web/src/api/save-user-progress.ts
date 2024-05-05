import { api } from '@/lib/axios'

type Params = {
  lesson_id: number
  is_completed: boolean
}

export async function saveUserProgress({ lesson_id, is_completed }: Params) {
  return api.post(`/progress/${lesson_id}`, {
    is_completed
  })
}
