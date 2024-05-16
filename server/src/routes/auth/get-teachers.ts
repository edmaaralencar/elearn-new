import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { db } from '@/db'
import { BadRequest } from '@/errors/bad-request'

export async function getTeachers(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/users/teachers',
    {
      schema: {
        summary: 'Get all teachres',
        tags: ['lessons'],
        response: {
          200: z.object({
            teachers: z
              .object({
                id: z.number(),
                name: z.string(),
                created_at: z.string(),
                email: z.string()
              })
              .array()
          })
        }
      }
    },
    async (request, reply) => {
      const teachers = await db
        .selectFrom('users')
        .select(['id', 'created_at', 'email', 'name'])
        .where('role', '==', 'TEACHER')
        .execute()

      return reply.status(200).send({
        teachers: teachers.map(teacher => ({
          ...teacher,
          id: Number(teacher.id)
        }))
      })
    }
  )
}
