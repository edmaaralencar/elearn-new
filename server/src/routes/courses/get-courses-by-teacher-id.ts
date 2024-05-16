import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { verifyJwt } from '@/middlewares/verify-jwt'
import { db } from '@/db'
import { sql } from 'kysely'
import { verifyUserRole } from '@/middlewares/verify-user-role'

export async function getCoursesByTeacherid(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)
  app.addHook('onRequest', verifyUserRole('TEACHER'))

  app.withTypeProvider<ZodTypeProvider>().get(
    '/teachers/courses',
    {
      schema: {
        summary: 'Get courses by teacher',
        tags: ['courses'],
        response: {
          201: z.object({
            courses: z
              .object({
                id: z.number().nullable(),
                title: z.string(),
                description: z.string().nullable(),
                coverImage: z.string().nullable(),
                is_published: z.boolean().nullable(),
                created_by: z.number(),
                modules: z.number(),
                technology: z.string()
              })
              .array()
          })
        }
      }
    },
    async (request, reply) => {
      const courses = await db
        .selectFrom('courses')
        .select(eb => [
          'courses.id',
          'courses.title as title',
          'courses.description',
          'courses.coverImage',
          'courses.is_published',
          'courses.created_by',
          'courses.technology',
          sql<number>`(
            select 
              count(*)
            from
              modules
            where modules.course_id = ${eb.ref('courses.id')}
          )`.as('modules')
        ])
        .where('created_by', '==', request.user.sub)
        .execute()

      return reply.status(201).send({
        courses: courses.map(course => ({
          ...course,
          is_published: course.is_published === 0 ? false : true
        }))
      })
    }
  )
}
