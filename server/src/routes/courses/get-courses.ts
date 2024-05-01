import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { verifyJwt } from '@/middlewares/verify-jwt'
import { db } from '@/db'

export async function getCourses(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.withTypeProvider<ZodTypeProvider>().get(
    '/courses',
    {
      schema: {
        summary: 'Get all courses',
        tags: ['courses'],
        querystring: z.object({
          type: z.enum(['mini-course', 'formation', 'all']),
          technology: z.string()
        }),
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
                type: z.string(),
                technology: z.string()
              })
              .array()
          })
        }
      }
    },
    async (request, reply) => {
      const { type, technology } = request.query

      let query = db
        .selectFrom('courses')
        .selectAll()
        .where('is_published', '==', 1)

      if (type !== 'all') {
        query = query.where('type', '==', type)
      }

      if (technology !== 'all') {
        query = query.where('technology', '==', technology)
      }

      const courses = await query.execute()

      return reply.status(201).send({
        courses: courses.map(course => ({
          ...course,
          is_published: course.is_published === 0 ? false : true
        }))
      })
    }
  )
}
