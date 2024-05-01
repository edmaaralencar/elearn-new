import { db } from '@/db'

export async function isUserOwnerOfTheCourse({
  courseId,
  userId
}: {
  userId: number
  courseId: number
}) {
  const isUserCourseOwner = await db
    .selectFrom('courses')
    .select(['id'])
    .where(eb =>
      eb.and({
        created_by: userId,
        'courses.id': courseId
      })
    )
    .executeTakeFirst()

  return Boolean(isUserCourseOwner)
}
