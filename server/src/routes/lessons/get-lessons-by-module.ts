import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { db } from '@/db'
import { BadRequest } from '@/errors/bad-request'

export async function getLessonsByModule(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/lessons/modules/:id',
    {
      schema: {
        summary: 'Get Lessons By Module',
        tags: ['lessons'],
        params: z.object({
          id: z.coerce.number()
        }),
        response: {
          201: z.object({
            lessons: z.array(
              z.object({
                slug: z.string(),
                id: z.number(),
                title: z.string(),
                duration: z.number()
              })
            )
          })
        }
      }
    },
    async (request, reply) => {
      const { id } = request.params

      const moduleExists = await db
        .selectFrom('modules')
        .selectAll()
        .where('id', '==', id)
        .executeTakeFirst()

      if (!moduleExists) {
        throw new BadRequest('Module does not exists.')
      }

      const lessons = await db
        .selectFrom('lessons')
        .select(['slug', 'id', 'title', 'duration'])
        .where('module_id', '==', id)
        .execute()

      return reply.status(201).send({
        lessons: lessons.map(lesson => ({
          ...lesson,
          duration: Number(lesson.duration)
        }))
      })
    }
  )
}
