import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { verifyJwt } from '@/middlewares/verify-jwt'

export async function signOut(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.withTypeProvider<ZodTypeProvider>().post(
    '/users/sign-out',
    {
      schema: {
        summary: 'Signout an user',
        tags: ['users'],
        response: {
          200: z.null()
        }
      }
    },
    async (_, reply) => {
      reply.clearCookie('token')

      reply.code(200).send()
    }
  )
}
