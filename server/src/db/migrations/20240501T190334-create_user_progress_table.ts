import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('users_progress')
    .addColumn('id', 'integer', col =>
      col.primaryKey().autoIncrement().notNull()
    )
    .addColumn('is_completed', 'boolean', col => col.notNull())
    .addColumn('user_id', 'integer', col =>
      col.references('users.id').onDelete('cascade').notNull()
    )
    .addColumn('lesson_id', 'integer', col =>
      col.references('lessons.id').onDelete('cascade').notNull()
    )
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('users_progress').execute()
}
