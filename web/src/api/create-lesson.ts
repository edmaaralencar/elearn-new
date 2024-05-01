import { api } from '@/lib/axios'

type Params = {
  title: string
  course_id: number
  chapter_id: number
  description: string
  video_url: string
  duration: number
}

export async function createLesson({
  course_id,
  description,
  chapter_id,
  title,
  video_url,
  duration
}: Params) {
  return api.post('/lessons', {
    name,
    description,
    course_id,
    chapter_id,
    title,
    video_url,
    duration
  })
}
