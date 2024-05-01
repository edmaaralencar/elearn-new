import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { db } from '@/db'
import { verifyJwt } from '@/middlewares/verify-jwt'
import { BadRequest } from '@/errors/bad-request'
import { verifyUserRole } from '@/middlewares/verify-user-role'
import { isUserOwnerOfTheCourse } from '@/utils/is-user-owner-of-the-course'

export async function deleteModule(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)
  app.addHook('onRequest', verifyUserRole('TEACHER'))

  app.withTypeProvider<ZodTypeProvider>().delete(
    '/modules/:id',
    {
      schema: {
        summary: 'Delete an module',
        tags: ['modules'],
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

      const moduleExists = await db
        .selectFrom('modules')
        .select(['id', 'course_id'])
        .where('id', '==', id)
        .executeTakeFirst()

      if (!moduleExists) {
        throw new BadRequest('Module does not exists.')
      }

      const isUserCourseOwner = await isUserOwnerOfTheCourse({
        courseId: moduleExists.course_id,
        userId: request.user.sub
      })

      if (!isUserCourseOwner) {
        throw new BadRequest('You are not the creator of this course.')
      }

      await db.transaction().execute(async tx => {
        await tx
          .updateTable('chapters')
          .set({
            module_id: -1
          })
          .where('module_id', '==', id)
          .executeTakeFirstOrThrow()

        return await tx
          .deleteFrom('modules')
          .where('id', '==', id)
          .executeTakeFirst()
      })

      return reply.status(200).send()
    }
  )
}
