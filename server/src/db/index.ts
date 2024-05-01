import SQLite from 'better-sqlite3'
import { Kysely, ParseJSONResultsPlugin, SqliteDialect } from 'kysely'
import { DB } from './schema'

const dialect = new SqliteDialect({
  database: new SQLite('dev.db')
})

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const db = new Kysely<DB>({
  dialect,
  plugins: [new ParseJSONResultsPlugin()]
})
