import { api } from '@/lib/axios'

export async function deleteChapter(chapter_id: string) {
  await api.delete(`/chapters/${chapter_id}`)
}
