import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { db } from '@/db'
import { BadRequest } from '@/errors/bad-request'
import dayjs from 'dayjs'
import { formatDateToSqlite } from '@/utils/format-date-to-sqlite'

export async function validateVerificationCode(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users/validate',
    {
      schema: {
        summary: 'Validate verification code of the user',
        tags: ['users'],
        body: z.object({
          code: z.number().min(6),
          email: z.string()
        }),
        response: {
          201: z.null()
        }
      }
    },
    async (request, reply) => {
      const { email, code } = request.body

      const userExists = await db
        .selectFrom('users')
        .select('id')
        .where('email', '==', email)
        .executeTakeFirst()

      if (!userExists) {
        throw new BadRequest('User does not exists.')
      }

      const verificationCode = await db
        .selectFrom('verification_codes')
        .select(['code', 'expires_at', 'id'])
        .where('email', '==', email)
        .executeTakeFirst()

      if (!verificationCode) {
        throw new BadRequest(
          'There is no validation code for this specific email.'
        )
      }

      if (verificationCode.code !== code) {
        throw new BadRequest('Invalid code.')
      }

      const hasExpired = dayjs(new Date(verificationCode.expires_at)).isBefore(
        dayjs()
      )

      if (hasExpired) {
        throw new BadRequest('Code has expired. Check your email again.')
      }

      await db
        .updateTable('users')
        .set({
          email_verified: formatDateToSqlite(dayjs().toDate())
        })
        .where('id', '==', userExists.id)
        .execute()

      await db
        .deleteFrom('verification_codes')
        .where('id', '==', verificationCode.id)
        .execute()

      return reply.status(200).send()
    }
  )
}
