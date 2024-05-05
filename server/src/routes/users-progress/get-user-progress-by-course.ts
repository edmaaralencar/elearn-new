import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { db } from '@/db'
import { verifyJwt } from '@/middlewares/verify-jwt'
import { BadRequest } from '@/errors/bad-request'

export async function getUserProgressByCourse(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.withTypeProvider<ZodTypeProvider>().get(
    '/progress/:id',
    {
      schema: {
        summary: 'Get course progress',
        tags: ['courses'],
        params: z.object({
          id: z.coerce.number()
        }),
        response: {
          201: z.object({
            progress: z
              .object({
                id: z.number(),
                course_id: z.number(),
                is_completed: z.boolean(),
                lesson_id: z.number(),
                user_id: z.number()
              })
              .array()
          })
        }
      }
    },
    async (request, reply) => {
      const { id } = request.params

      const userProgress = await db
        .selectFrom('users_progress')
        .selectAll()
        .where(eb =>
          eb.and({
            'users_progress.course_id': id,
            user_id: request.user.sub
          })
        )
        .execute()

      return reply.status(200).send({
        progress: userProgress.map(progress => ({
          ...progress,
          is_completed: progress.is_completed === 1 ? true : false
        }))
      })
    }
  )
}
