import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { db } from '@/db'
import { BadRequest } from '@/errors/bad-request'
import { verifyJwt } from '@/middlewares/verify-jwt'

export async function profile(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.withTypeProvider<ZodTypeProvider>().get(
    '/users/me',
    {
      schema: {
        summary: 'Get user profile',
        tags: ['users'],
        response: {
          200: z.object({
            name: z.string(),
            email: z.string(),
            role: z.string()
          })
        }
      }
    },
    async (request, reply) => {
      const user = await db
        .selectFrom('users')
        .select(['name', 'email', 'role'])
        .where('id', '==', request.user.sub)
        .executeTakeFirst()

      if (!user) {
        throw new BadRequest('User does not exists.')
      }

      return reply.status(200).send({
        email: user.email,
        name: user.name,
        role: user.role
      })
    }
  )
}
