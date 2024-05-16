import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { db } from '@/db'
import { BadRequest } from '@/errors/bad-request'
import { generateVerificationCode } from '@/utils/generate-verification-code'
import { generateAccountHtml, resend } from '@/lib/resend'
import { verifyJwt } from '@/middlewares/verify-jwt'
import { verifyUserRole } from '@/middlewares/verify-user-role'

export async function registerTeacher(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)
  app.addHook('onRequest', verifyUserRole('ADMIN'))

  app.withTypeProvider<ZodTypeProvider>().post(
    '/users/teachers',
    {
      schema: {
        summary: 'Register an teacher',
        tags: ['users'],
        body: z.object({
          name: z.string().min(4),
          email: z.string()
        }),
        response: {
          201: z.null()
        }
      }
    },
    async (request, reply) => {
      const { email, name } = request.body

      const userExists = await db
        .selectFrom('users')
        .select('id')
        .where('email', '==', email)
        .executeTakeFirst()

      if (userExists) {
        throw new BadRequest('User already exists.')
      }

      const currUser = await db
        .selectFrom('users')
        .selectAll()
        .where('id', '==', request.user.sub)
        .executeTakeFirstOrThrow()

      await db
        .insertInto('users')
        .values({
          email,
          name,
          role: 'TEACHER'
        })
        .executeTakeFirstOrThrow()

      const verificationCode = await generateVerificationCode(email)

      const url = `http://localhost:5173/generate-password?code=${verificationCode}&email=${email}`

      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: 'edmaaralencar1@gmail.com',
        subject: 'Cria sua senha!',
        html: generateAccountHtml({
          invitedBy: currUser.name,
          invitedByEmail: currUser.email,
          invitedName: name,
          signUpLink: url
        })
      })

      return reply.status(201).send()
    }
  )
}
