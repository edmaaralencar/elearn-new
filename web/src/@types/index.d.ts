export interface ILesson {
  asset_id: string
  module_id: number
  course_id: number
  description: string
  id: number
  playback_id: string
  position: number
  title: string
  video_url: string
  slug: string
  duration: number
}

export interface ICourse {
  coverImage: string | null
  created_by: number
  description: string | null
  id: number
  is_published: number
  title: string
  technology: string
}

export interface IModule {
  course_id: number
  description: string
  id: number
  is_published: number
  position: number
  slug: string
  title: string
  type: string
}

export interface IUserProgress {
  course_id: number
  id: number
  is_completed: number
  lesson_id: number
  user_id: number
}
