import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('courses')
    .addColumn('id', 'integer', col =>
      col.primaryKey().autoIncrement().notNull()
    )
    .addColumn('title', 'text', col => col.notNull())
    .addColumn('type', 'text', col => col.notNull()) // formation / mini-course
    .addColumn('description', 'text')
    .addColumn('coverImage', 'text')
    .addColumn('technology', 'text', col => col.notNull())
    .addColumn('slug', 'text', col => col.notNull())
    .addColumn('is_published', 'boolean', col => col.notNull())
    .addColumn('created_by', 'integer', col =>
      col.references('users.id').onDelete('cascade').notNull()
    )
    .execute()

  await db.schema
    .createTable('lessons')
    .addColumn('id', 'integer', col =>
      col.primaryKey().autoIncrement().notNull()
    )
    .addColumn('title', 'text', col => col.notNull())
    .addColumn('description', 'text', col => col.notNull())
    .addColumn('asset_id', 'text', col => col.notNull())
    .addColumn('video_url', 'text', col => col.notNull())
    .addColumn('playback_id', 'text', col => col.notNull())
    .addColumn('position', 'integer', col => col.notNull())
    .addColumn('duration', 'decimal', col => col.notNull())
    .addColumn('slug', 'text', col => col.notNull())
    .addColumn('course_id', 'integer', col =>
      col.references('courses.id').onDelete('cascade').notNull()
    )
    .addColumn('module_id', 'integer', col =>
      col.references('modules.id').onDelete('cascade').notNull()
    )
    .execute()

  await db.schema
    .createTable('modules')
    .addColumn('id', 'integer', col =>
      col.primaryKey().autoIncrement().notNull()
    )
    .addColumn('title', 'text', col => col.notNull())
    .addColumn('description', 'text', col => col.notNull())
    .addColumn('position', 'integer', col => col.notNull())
    .addColumn('is_published', 'boolean', col => col.notNull())
    .addColumn('type', 'text', col => col.notNull())
    .addColumn('slug', 'text', col => col.notNull())
    .addColumn('course_id', 'integer', col =>
      col.references('courses.id').onDelete('cascade').notNull()
    )
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('courses').execute()
  await db.schema.dropTable('lessons').execute()
  await db.schema.dropTable('modules').execute()
}
