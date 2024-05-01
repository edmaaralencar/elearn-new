import { api } from '@/lib/axios'

type Params = {
  list: Array<{
    id: number
    position: number
  }>
  type: 'CHAPTER' | 'LESSON'
  courseId: number
}

export async function reorderList({ courseId, list, type }: Params) {
  return api.put('/teachers/items/reorder', {
    courseId,
    list,
    type
  })
}
