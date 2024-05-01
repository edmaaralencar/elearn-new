import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { db } from '@/db'
import { verifyJwt } from '@/middlewares/verify-jwt'
import { BadRequest } from '@/errors/bad-request'
import { isUserOwnerOfTheCourse } from '@/utils/is-user-owner-of-the-course'
import { verifyUserRole } from '@/middlewares/verify-user-role'
import { createSlugFromText } from '@/utils/create-slug-from-text'

export async function createModule(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)
  app.addHook('onRequest', verifyUserRole('TEACHER'))

  app.withTypeProvider<ZodTypeProvider>().post(
    '/modules',
    {
      schema: {
        summary: 'Create an module',
        tags: ['modules'],
        body: z.object({
          title: z.string(),
          course_id: z.number(),
          description: z.string(),
          type: z.string()
        }),
        response: {
          201: z.object({
            id: z.number()
          })
        }
      }
    },
    async (request, reply) => {
      const { title, course_id, description, type } = request.body

      const isUserCourseOwner = await isUserOwnerOfTheCourse({
        courseId: course_id,
        userId: request.user.sub
      })

      if (!isUserCourseOwner) {
        throw new BadRequest('You are not the creator of this course.')
      }

      const module = await db
        .insertInto('modules')
        .values({
          course_id,
          title,
          description,
          slug: createSlugFromText(title),
          type
        })
        .returning('id')
        .executeTakeFirstOrThrow()

      return reply.status(201).send({
        id: module.id
      })
    }
  )
}
