import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { db } from '@/db'
import { verifyJwt } from '@/middlewares/verify-jwt'
import { verifyUserRole } from '@/middlewares/verify-user-role'
import { createSlugFromText } from '@/utils/create-slug-from-text'

export async function createCourse(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.withTypeProvider<ZodTypeProvider>().post(
    '/courses',
    {
      schema: {
        summary: 'Create an user progress',
        tags: ['users progress'],
        body: z.object({
          lesson_id: z.number()
        }),
        response: {
          201: z.object({
            id: z.number()
          })
        }
      }
    },
    async (request, reply) => {
      const { lesson_id } = request.body

      const userProgressExists = await db
        .insertInto('courses')
        .values({
          title,
          created_by: request.user.sub,
          type,
          technology,
          slug: createSlugFromText(title)
        })
        .returning('id')
        .executeTakeFirstOrThrow()

      return reply.status(201).send({
        id: course.id
      })
    }
  )
}
