import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('users_progress')
    .addColumn('course_id', 'integer', col =>
      col.references('courses.id').onDelete('cascade').notNull()
    )
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('users_progress').dropColumn('course_id').execute()
}
