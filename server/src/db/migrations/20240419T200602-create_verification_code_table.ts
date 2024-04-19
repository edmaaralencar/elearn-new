import { type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('verification_codes')
    .addColumn(
      'id',
      'integer',
      (col) => col.primaryKey().autoIncrement(),
      // col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('email', 'text', (col) => col.notNull())
    .addColumn('code', 'integer', (col) => col.notNull().unique())
    .addColumn('expires_at', 'text', (col) => col.notNull())
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('verification_codes').execute()
}
