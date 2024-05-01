import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { db } from '@/db'
import { verifyJwt } from '@/middlewares/verify-jwt'
import { BadRequest } from '@/errors/bad-request'
import { verifyUserRole } from '@/middlewares/verify-user-role'
import { isUserOwnerOfTheCourse } from '@/utils/is-user-owner-of-the-course'
import { uploadProvider } from '@/providers/upload-provider'

export async function deleteLesson(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)
  app.addHook('onRequest', verifyUserRole('TEACHER'))

  app.withTypeProvider<ZodTypeProvider>().delete(
    '/lessons/:id',
    {
      schema: {
        summary: 'Delete an lesson',
        tags: ['lessons'],
        params: z.object({
          id: z.coerce.number()
        }),
        response: {
          200: z.null()
        }
      }
    },
    async (request, reply) => {
      const { id } = request.params

      const lessonExists = await db
        .selectFrom('lessons')
        .select(['id', 'course_id', 'video_url'])
        .where('id', '==', id)
        .executeTakeFirst()

      if (!lessonExists) {
        throw new BadRequest('Chapter does not exists.')
      }

      const isUserCourseOwner = await isUserOwnerOfTheCourse({
        courseId: lessonExists.course_id,
        userId: request.user.sub
      })

      if (!isUserCourseOwner) {
        throw new BadRequest('You are not the creator of this course.')
      }

      await uploadProvider.deleteFile(lessonExists.video_url)

      await db
        .deleteFrom('lessons')
        .where('lessons.id', '==', id)
        .executeTakeFirst()

      return reply.status(200).send()
    }
  )
}
