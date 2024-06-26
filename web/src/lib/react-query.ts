import { Params } from '@/api/get-courses'
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient()

export const queryKeys = {
  profile: ['profile'],
  courses: ({ technology, type }: Params) => ['courses', { type, technology }],
  course: (courseId: string) => ['courses', courseId],
  courseDetails: (courseId: string) => ['courses', courseId, 'details'],
  lessonsByModule: (moduleId: string) => ['modules', moduleId, 'lessons'],
  modulesByCourse: (courseId: string) => ['modules', 'course', courseId],
  lesson: (slug: string) => ['lessons', slug],
  progressByCourse: (lessonId: string) => ['progress', lessonId],
  subscription: ['subscription']
}
