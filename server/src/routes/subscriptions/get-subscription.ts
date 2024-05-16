import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import Stripe from 'stripe'

import { verifyJwt } from '@/middlewares/verify-jwt'
import { BadRequest } from '@/errors/bad-request'
import { stripe } from '@/lib/stripe'

export async function getSubscription(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.withTypeProvider<ZodTypeProvider>().get(
    '/subscription',
    {
      schema: {
        summary: 'Get subscription',
        tags: ['subscriptions'],
        response: {
          200: z.object({
            id: z.string(),
            price: z.number(),
            name: z.string(),
            image: z.string(),
            description: z.string(),
            features: z.array(z.string())
          })
        }
      }
    },
    async (request, reply) => {
      const prices = await stripe.prices.list({
        expand: ['data.product']
      })

      const subscription = prices.data[prices.data.length - 1]

      if (!subscription) {
        throw new BadRequest()
      }

      const product = subscription.product as Stripe.Product

      return reply.status(201).send({
        price: Number(subscription.unit_amount) / 100,
        id: subscription.id,
        name: product.name,
        image: product.images[0],
        description: product.description ?? '',
        features: product.marketing_features.map(item => item.name ?? '')
      })
    }
  )
}
