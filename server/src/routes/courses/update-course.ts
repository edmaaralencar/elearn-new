import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { db } from '@/db'
import { verifyJwt } from '@/middlewares/verify-jwt'
import { verifyUserRole } from '@/middlewares/verify-user-role'
import { isUserOwnerOfTheCourse } from '@/utils/is-user-owner-of-the-course'
import { BadRequest } from '@/errors/bad-request'

export async function updateCourse(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)
  app.addHook('onRequest', verifyUserRole('TEACHER'))

  app.withTypeProvider<ZodTypeProvider>().patch(
    '/courses/:id',
    {
      schema: {
        summary: 'Update an course',
        tags: ['courses'],
        params: z.object({
          id: z.coerce.number()
        }),
        body: z.object({
          title: z.string().optional(),
          description: z.string().optional(),
          is_published: z.boolean().optional()
        }),
        response: {
          201: z.object({
            id: z.number()
          })
        }
      }
    },
    async (request, reply) => {
      const { title, description, is_published } = request.body
      const { id } = request.params

      const isUserCourseOwner = await isUserOwnerOfTheCourse({
        courseId: id,
        userId: request.user.sub
      })

      if (!isUserCourseOwner) {
        throw new BadRequest('You are not the creator of this course.')
      }

      const course = await db
        .updateTable('courses')
        .set({
          title,
          description,
          is_published: is_published ? 1 : 0
        })
        .where('id', '==', Number(id))
        .returning('id')
        .executeTakeFirstOrThrow()

      return reply.status(201).send({
        id: course.id
      })
    }
  )
}
