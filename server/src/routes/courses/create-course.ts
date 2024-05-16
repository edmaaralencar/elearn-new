import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { db } from '@/db'
import { verifyJwt } from '@/middlewares/verify-jwt'
import { verifyUserRole } from '@/middlewares/verify-user-role'
import { createSlugFromText } from '@/utils/create-slug-from-text'

export async function createCourse(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)
  app.addHook('onRequest', verifyUserRole('TEACHER'))

  app.withTypeProvider<ZodTypeProvider>().post(
    '/courses',
    {
      schema: {
        summary: 'Create an course',
        tags: ['courses'],
        body: z.object({
          title: z.string().min(2),
          type: z.enum(['mini-course', 'formation']),
          technology: z.string()
        }),
        response: {
          201: z.object({
            id: z.number()
          })
        }
      }
    },
    async (request, reply) => {
      const { title, type, technology } = request.body

      const course = await db
        .insertInto('courses')
        .values({
          title,
          created_by: request.user.sub,
          type,
          technology,
          slug: createSlugFromText(title),
          is_published: 0
        })
        .returning('id')
        .executeTakeFirstOrThrow()

      return reply.status(201).send({
        id: course.id
      })
    }
  )
}
