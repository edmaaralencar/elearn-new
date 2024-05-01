export interface IChapter {
  course_id: number
  module_id: number
  id: number
  name: string
  position: number
}

export interface ILesson {
  asset_id: string
  chapter_id: number
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
  id: number
  type: string
  title: string
  description: string
  course_id: number
  slug: string
}
