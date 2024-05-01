import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { db } from '@/db'
import { verifyJwt } from '@/middlewares/verify-jwt'
import { BadRequest } from '@/errors/bad-request'
import { verifyUserRole } from '@/middlewares/verify-user-role'
import { sql } from 'kysely'

export async function getModulesByCourse(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)
  app.addHook('onRequest', verifyUserRole('TEACHER'))

  app.withTypeProvider<ZodTypeProvider>().get(
    '/modules/courses/:id',
    {
      schema: {
        summary: 'Get Modules Courses',
        tags: ['modules'],
        params: z.object({
          id: z.coerce.number()
        }),
        response: {
          200: z.object({
            modules: z.array(
              z.object({
                title: z.string(),
                description: z.string(),
                type: z.string(),
                id: z.number(),
                course_id: z.number(),
                slug: z.string(),
                lessons_count: z.number(),
                total_duration: z.number()
              })
            )
          })
        }
      }
    },
    async (request, reply) => {
      const { id } = request.params

      const courseExists = await db
        .selectFrom('courses')
        .selectAll()
        .where('id', '==', id)
        .executeTakeFirst()

      if (!courseExists) {
        throw new BadRequest('Module does not exists.')
      }

      const modules = await db
        .selectFrom('modules')
        .select(eb => [
          'id',
          'course_id',
          'description',
          'slug',
          'title',
          'type',
          sql<number>`(
            select 
              count(*)
            from
              lessons
            where lessons.module_id = ${eb.ref('modules.id')}
          )`.as('lessons_count'),
          sql<number>`(
            select
              IFNULL(sum(CAST(lessons.duration as decimal)), 0)
            from
              lessons
            where lessons.module_id = ${eb.ref('modules.id')}
          )`.as('total_duration')
        ])
        .where('course_id', '==', id)
        .execute()

      return reply.status(200).send({
        modules
      })
    }
  )
}
