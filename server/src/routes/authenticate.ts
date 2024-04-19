import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { db } from '@/db'
import { BadRequest } from '@/errors/bad-request'
import { compare } from 'bcryptjs'
import { generateVerificationCode } from '@/utils/generate-verification-code'
import { resend, verifyEmailHtml } from '@/lib/resend'

export async function authenticate(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users/authenticate',
    {
      schema: {
        summary: 'Authenticate an user',
        tags: ['users'],
        body: z.object({
          email: z.string(),
          password: z.string().min(6),
        }),
        response: {
          200: z.string(),
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body

      const userExists = await db
        .selectFrom('users')
        .select(['id', 'password', 'email_verified', 'email'])
        .where('email', '==', email)
        .executeTakeFirst()

      if (!userExists) {
        throw new BadRequest('Invalid credentials.')
      }

      if (!userExists.email_verified) {
        const verificationCode = await generateVerificationCode(
          userExists.email,
        )

        const url = `http://localhost:5173/verification-code?email=${email}&code=${verificationCode}`

        await resend.emails.send({
          from: 'onboarding@resend.dev',
          to: 'edmaaralencar1@gmail.com',
          subject: 'Confirme seu email!',
          html: verifyEmailHtml({ code: verificationCode, url }),
        })

        throw new BadRequest('Email has not been verified.')
      }

      const passwordMatches = await compare(password, userExists.password)

      if (!passwordMatches) {
        throw new BadRequest('Invalid credentials.')
      }

      const token = await reply.jwtSign(
        {
          role: 'USER',
        },
        {
          sign: {
            sub: String(userExists.id),
          },
        },
      )

      reply
        .setCookie('token', token, {
          // domain: 'localhost',
          path: '/',
          secure: true, // send cookie over HTTPS only
          httpOnly: true,
          sameSite: true, // alternative CSRF protection
        })
        .code(200)
        .send('Cookie sent')
    },
  )
}
