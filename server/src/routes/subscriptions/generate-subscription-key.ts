import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { db } from '@/db'
import { verifyJwt } from '@/middlewares/verify-jwt'
import { BadRequest } from '@/errors/bad-request'
import { isUserOwnerOfTheCourse } from '@/utils/is-user-owner-of-the-course'
import { createSlugFromText } from '@/utils/create-slug-from-text'

export async function generateSubscriptionKey(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.withTypeProvider<ZodTypeProvider>().post(
    '/subscription/key',
    {
      schema: {
        summary: 'Generate subscription key',
        tags: ['subscriptions'],
        body: z.object({
          name: z.string(),
          cpf: z.string(),
          phone: z.string(),
          cep: z.string(),
          street: z.string(),
          number: z.number(),
          complement: z.string(),
          neighbourhood: z.string(),
          city: z.string(),
          state: z.string()
        }),
        response: {
          201: z.object({
            key: z.string()
          })
        }
      }
    },
    async (request, reply) => {
      const {
        cep,
        city,
        complement,
        cpf,
        name,
        neighbourhood,
        number,
        phone,
        state,
        street
      } = request.body

      return reply.status(201).send({
        key: 'module.id'
      })
    }
  )
}
