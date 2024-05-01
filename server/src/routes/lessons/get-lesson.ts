import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { db } from '@/db'
import { BadRequest } from '@/errors/bad-request'

export async function getLesson(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/lessons/:slug',
    {
      schema: {
        summary: 'Get an lesson',
        tags: ['lessons'],
        params: z.object({
          slug: z.string()
        }),
        response: {
          200: z.object({
            lesson: z.object({
              asset_id: z.string(),
              chapter_id: z.number(),
              course_id: z.number(),
              description: z.string(),
              id: z.number(),
              playback_id: z.string(),
              title: z.string(),
              video_url: z.string(),
              slug: z.string(),
              duration: z.number()
            })
          })
        }
      }
    },
    async (request, reply) => {
      const { slug } = request.params

      const lesson = await db
        .selectFrom('lessons')
        .selectAll()
        .where('slug', '==', slug)
        .executeTakeFirst()

      if (!lesson) {
        throw new BadRequest('Lesson does not exists.')
      }

      return reply.status(200).send({
        lesson: {
          ...lesson,
          duration: Number(lesson.duration)
        }
      })
    }
  )
}
