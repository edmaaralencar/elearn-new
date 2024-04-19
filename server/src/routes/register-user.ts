import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { db } from '@/db'
import { BadRequest } from '@/errors/bad-request'
import { hash } from 'bcryptjs'
import { generateVerificationCode } from '@/utils/generate-verification-code'
import { resend, verifyEmailHtml } from '@/lib/resend'

export async function registerUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users',
    {
      schema: {
        summary: 'Register an user',
        tags: ['users'],
        body: z.object({
          name: z.string().min(4),
          email: z.string(),
          password: z.string().min(6),
        }),
        response: {
          201: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { email, name, password } = request.body

      const userExists = await db
        .selectFrom('users')
        .select('id')
        .where('email', '==', email)
        .executeTakeFirst()

      if (userExists) {
        throw new BadRequest('User already exists.')
      }

      await db
        .insertInto('users')
        .values({
          email,
          name,
          password: await hash(password, 8),
        })
        .executeTakeFirstOrThrow()

      const verificationCode = await generateVerificationCode(email)

      const url = `http://localhost:5173/verification-code?email=${email}&code=${verificationCode}`

      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: 'edmaaralencar1@gmail.com',
        subject: 'Confirme seu email!',
        html: verifyEmailHtml({ code: verificationCode, url })
      })

      return reply.status(201).send()
    },
  )
}
