import { api } from '@/lib/axios'

export async function deleteLesson(lesson_id: string) {
  await api.delete(`/lessons/${lesson_id}`)
}
