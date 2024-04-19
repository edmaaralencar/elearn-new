import { db } from '@/db'
import { formatDateToSqlite } from './format-date-to-sqlite'

export async function generateVerificationCode(email: string) {
  const code = Math.floor(100000 + Math.random() * 900000)
  const expires = new Date(new Date().getTime() + 600000) // 10 minutos

  const existingCode = await db
    .selectFrom('verification_codes')
    .select('id')
    .where('email', '==', email)
    .executeTakeFirst()

  if (existingCode) {
    await db
      .deleteFrom('verification_codes')
      .where('id', '==', existingCode.id)
      .execute()
  }

  const verificationCode = await db
    .insertInto('verification_codes')
    .values({
      code,
      email,
      expires_at: formatDateToSqlite(expires),
    })
    .returningAll()
    .executeTakeFirstOrThrow()

  return verificationCode.code
}
