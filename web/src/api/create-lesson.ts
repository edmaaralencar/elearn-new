import { api } from '@/lib/axios'

type Params = {
  title: string
  course_id: number
  module_id: number
  description: string
  video_url: string
  duration: number
}

export async function createLesson({
  course_id,
  description,
  module_id,
  title,
  video_url,
  duration
}: Params) {
  return api.post('/lessons', {
    name,
    description,
    course_id,
    module_id,
    title,
    video_url,
    duration
  })
}
