import type { ColumnType } from 'kysely'

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>

export interface Courses {
  coverImage: string | null
  created_by: number
  description: string | null
  id: Generated<number>
  is_published: number
  slug: string
  technology: string
  title: string
  type: string
}

export interface Lessons {
  asset_id: string
  course_id: number
  description: string
  duration: string
  id: Generated<number>
  module_id: number
  playback_id: string
  position: number
  slug: string
  title: string
  video_url: string
}

export interface Modules {
  course_id: number
  description: string
  id: Generated<number>
  is_published: number
  position: number
  slug: string
  title: string
  type: string
}

export interface Users {
  created_at: Generated<string>
  email: string
  email_verified: string | null
  id: Generated<number | null>
  name: string
  password: string | null
  role: Generated<string>
}

export interface UsersProgress {
  course_id: number
  id: Generated<number>
  is_completed: number
  lesson_id: number
  user_id: number
}

export interface VerificationCodes {
  code: number
  email: string
  expires_at: string
  id: Generated<number | null>
}

export interface DB {
  courses: Courses
  lessons: Lessons
  modules: Modules
  users: Users
  users_progress: UsersProgress
  verification_codes: VerificationCodes
}
