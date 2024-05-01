import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { db } from '@/db'
import { BadRequest } from '@/errors/bad-request'

export async function getCourseDetails(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/courses/:id/details',
    {
      schema: {
        summary: 'Get course details',
        tags: ['courses'],
        params: z.object({
          id: z.string()
        }),
        response: {
          201: z.object({
            course: z.object({
              id: z.number(),
              title: z.string(),
              description: z.string().nullable(),
              coverImage: z.string().nullable(),
              is_published: z.boolean(),
              created_by: z.number(),
              technology: z.string(),
              slug: z.string()
            })
          })
        }
      }
    },
    async (request, reply) => {
      const { id } = request.params

      const course = await db
        .selectFrom('courses')
        .selectAll()
        .where('id', '==', Number(id))
        .executeTakeFirst()

      if (!course) {
        throw new BadRequest('Course does not exists.')
      }

      return reply.status(201).send({
        course: {
          ...course,
          is_published: course.is_published === 0 ? false : true
        }
      })
    }
  )
}
