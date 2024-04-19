import { promises as fs } from 'node:fs'
import * as path from 'node:path'
import { FileMigrationProvider, Migrator } from 'kysely'
import { run } from 'kysely-migration-cli'

// const migrationFolder = new URL('./migrations')

// console.log({ migrationFolder })

import { db } from './index'
const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs,
    path,
    migrationFolder: path.join(__dirname, './migrations'),
  }),
})

run(db, migrator, './src/db/migrations')
