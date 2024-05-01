import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { verifyJwt } from '@/middlewares/verify-jwt'
import { verifyUserRole } from '@/middlewares/verify-user-role'
import { db } from '@/db'
import { BadRequest } from '@/errors/bad-request'
import { isUserOwnerOfTheCourse } from '@/utils/is-user-owner-of-the-course'

export async function reorderList(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)
  app.addHook('onRequest', verifyUserRole('TEACHER'))

  app.withTypeProvider<ZodTypeProvider>().put(
    '/teachers/items/reorder',
    {
      schema: {
        summary: 'Reoder items',
        tags: ['items'],
        body: z.object({
          list: z.array(
            z.object({
              id: z.number(),
              position: z.number()
            })
          ),
          type: z.enum(['CHAPTER', 'LESSON']),
          courseId: z.number()
        }),
        response: {
          204: z.null()
        }
      }
    },
    async (request, reply) => {
      const { list, courseId, type } = request.body

      const isUserCourseOwner = await isUserOwnerOfTheCourse({
        courseId,
        userId: request.user.sub
      })

      if (!isUserCourseOwner) {
        throw new BadRequest('You are not the creator of this course.')
      }

      if (type === 'CHAPTER') {
        for (const item of list) {
          await db
            .updateTable('chapters')
            .where('id', '==', item.id)
            .set({
              position: item.position
            })
            .executeTakeFirstOrThrow()
        }

        return reply.status(204).send()
      } else if (type === 'LESSON') {
        for (const item of list) {
          await db
            .updateTable('lessons')
            .where('id', '==', item.id)
            .set({
              position: item.position
            })
            .executeTakeFirstOrThrow()
        }

        return reply.status(204).send()
      } else {
        throw new BadRequest()
      }
    }
  )
}
