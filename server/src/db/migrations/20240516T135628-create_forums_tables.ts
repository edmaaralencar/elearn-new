import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('forums')
    .addColumn('id', 'integer', col =>
      col.primaryKey().autoIncrement().notNull()
    )
    .addColumn('title', 'text', col => col.notNull())
    .addColumn('technology', 'text', col => col.notNull())
    .addColumn('slug', 'text', col => col.notNull())
    .addColumn('is_published', 'boolean', col => col.notNull())
    .addColumn('course_id', 'integer', col =>
      col.references('courses.id').onDelete('cascade').notNull()
    )
    .execute()

  await db.schema
    .createTable('topics')
    .addColumn('id', 'integer', col =>
      col.primaryKey().autoIncrement().notNull()
    )

    .addColumn('created_by', 'integer', col =>
      col.references('users.id').onDelete('cascade').notNull()
    )
}

export async function down(db: Kysely<any>): Promise<void> {}
