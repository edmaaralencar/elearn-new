import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { jsonArrayFrom } from 'kysely/helpers/sqlite'
import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { db } from '@/db'
import { verifyJwt } from '@/middlewares/verify-jwt'
import { sql } from 'kysely'
import { BadRequest } from '@/errors/bad-request'

export async function getChaptersByModule(app: FastifyInstance) {
  // app.addHook('onRequest', verifyJwt)

  app.withTypeProvider<ZodTypeProvider>().get(
    '/chapters/modules/:id',
    {
      schema: {
        summary: 'Get Chapters By Module',
        tags: ['chapters'],
        params: z.object({
          id: z.coerce.number()
        }),
        response: {
          201: z.object({
            chapters: z.array(
              z.object({
                id: z.number(),
                module_id: z.number(),
                course_id: z.number(),
                name: z.string(),
                position: z.number(),
                slug: z.string(),
                lessons: z.array(
                  z.object({
                    slug: z.string(),
                    id: z.number(),
                    title: z.string(),
                    duration: z.number()
                  })
                )
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

      const chapters = await db
        .selectFrom('chapters')
        .select(eb => [
          'id',
          'course_id',
          'module_id',
          'name',
          'position',
          'slug',
          jsonArrayFrom(
            eb
              .selectFrom('lessons')
              .select([
                'lessons.slug',
                'lessons.id',
                'lessons.title',
                'lessons.duration'
              ])
              .whereRef('lessons.chapter_id', '==', 'chapters.id')
          ).as('lessons')
        ])
        .where('module_id', '==', id)
        .execute()

      return reply.status(201).send({
        chapters: chapters.map(chapter => ({
          ...chapter,
          lessons: chapter.lessons.map(lesson => ({
            ...lesson,
            duration: Number(lesson.duration)
          }))
        }))
      })
    }
  )
}
