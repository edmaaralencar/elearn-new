import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { db } from '@/db'
import { verifyJwt } from '@/middlewares/verify-jwt'
import { BadRequest } from '@/errors/bad-request'

export async function saveUserProgress(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.withTypeProvider<ZodTypeProvider>().post(
    '/progress/:id',
    {
      schema: {
        summary: 'Save user progress',
        tags: ['users progress'],
        params: z.object({
          id: z.coerce.number()
        }),
        body: z.object({
          is_completed: z.boolean()
        }),
        response: {
          201: z.object({
            id: z.number()
          })
        }
      }
    },
    async (request, reply) => {
      const { is_completed } = request.body
      const { id } = request.params

      const userProgressExists = await db
        .selectFrom('users_progress')
        .select('id')
        .where(eb =>
          eb.and({
            'users_progress.lesson_id': id,
            'users_progress.user_id': request.user.sub
          })
        )
        .executeTakeFirst()

      if (userProgressExists) {
        await db
          .updateTable('users_progress')
          .set({
            is_completed: is_completed ? 1 : 0
          })
          .where('id', '==', userProgressExists.id)
          .executeTakeFirstOrThrow()

        return reply.status(201).send({
          id: userProgressExists.id
        })
      }

      const lesson = await db
        .selectFrom('lessons')
        .select('lessons.course_id')
        .where('id', '==', id)
        .executeTakeFirst()

      if (!lesson) {
        throw new BadRequest('Lesson does not exists.')
      }

      const userProgress = await db
        .insertInto('users_progress')
        .values({
          is_completed: is_completed ? 1 : 0,
          lesson_id: id,
          user_id: request.user.sub,
          course_id: lesson.course_id
        })
        .returning('id')
        .executeTakeFirstOrThrow()

      return reply.status(201).send({
        id: userProgress.id
      })
    }
  )
}
