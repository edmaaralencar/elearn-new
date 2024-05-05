import { hash } from 'bcryptjs'
import { db } from '.'
import { formatDateToSqlite } from '@/utils/format-date-to-sqlite'
import { createSlugFromText } from '@/utils/create-slug-from-text'

async function seedDatabase() {
  await db.deleteFrom('users').execute()
  await db.deleteFrom('courses').execute()

  const teacher = await db
    .insertInto('users')
    .values({
      email: 'teacher@gmail.com',
      name: 'Professor 1',
      password: await hash('teste123', 8),
      created_at: formatDateToSqlite(new Date()),
      email_verified: formatDateToSqlite(new Date()),
      role: 'TEACHER'
    })
    .returning('id')
    .executeTakeFirst()

  await db
    .insertInto('users')
    .values({
      email: 'admin@gmail.com',
      name: 'Admin',
      password: await hash('teste123', 8),
      created_at: formatDateToSqlite(new Date()),
      email_verified: formatDateToSqlite(new Date()),
      role: 'ADMIN'
    })
    .execute()
  await db
    .insertInto('users')
    .values({
      email: 'edmar@gmail.com',
      name: 'Edmar',
      password: await hash('teste123', 8),
      created_at: formatDateToSqlite(new Date()),
      email_verified: formatDateToSqlite(new Date()),
      role: 'USER'
    })
    .execute()

  const course = await db
    .insertInto('courses')
    .values({
      title: 'React.js',
      created_by: Number(teacher?.id),
      technology: 'react',
      description:
        'Curso 100% atualizado mostrando as principais tecnologias utilizadas com React.',
      type: 'formation',
      is_published: 1,
      slug: createSlugFromText('react js')
    })
    .returning('id')
    .executeTakeFirstOrThrow()

  await db
    .insertInto('courses')
    .values({
      title: 'Clone de IFood',
      created_by: Number(teacher?.id),
      technology: 'react-native',
      description:
        'Clone de IFood utilizando as tecnologias mais atualizadas do mercado.',
      type: 'mini-course',
      is_published: 1,
      slug: createSlugFromText('Clone do IFood')
    })
    .executeTakeFirstOrThrow()

  await db
    .insertInto('courses')
    .values({
      title: 'Node.js',
      created_by: Number(teacher?.id),
      technology: 'node.js',
      description:
        'Curso 100% atualizado mostrando as principais tecnologias utilizadas com Node.js',
      type: 'formation',
      is_published: 1,
      slug: createSlugFromText('Node.js')
    })
    .executeTakeFirstOrThrow()

  await db
    .insertInto('courses')
    .values({
      title: 'Deploy de aplicação Node.js na AWS',
      created_by: Number(teacher?.id),
      technology: 'node.js',
      description:
        'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quis quas debitis, doloremque saepe veniam, dignissimos, molestiae eligendi dolorem voluptatum porro repellendus culpa deserunt temporibus quam magni ipsam id dolore! Impedit.',
      type: 'mini-course',
      is_published: 1,
      slug: createSlugFromText('Deploy de aplicação Node.js na AWS')
    })
    .executeTakeFirstOrThrow()

  const module = await db
    .insertInto('modules')
    .values({
      course_id: course.id,
      description:
        'Nesse módulo, criaremos uma aplicação React utilizando o Vite e aprenderemos sobre os conceitos mais importantes do React, entre eles estão componentização, propriedades, estados, imutabilidade e hooks, além de aplicar o TypeScript no nosso projeto para adicionar tipagem estática à aplicação.',
      title: 'Iniciando com React.js',
      type: 'module',
      slug: createSlugFromText('Iniciando com React.js')
    })
    .returning('id')
    .executeTakeFirstOrThrow()

  const fundamentals = await db
    .insertInto('chapters')
    .values({
      course_id: course.id,
      name: 'Iniciando com React.js',
      position: 0,
      is_published: 0,
      module_id: module.id,
      slug: createSlugFromText('Iniciando com React.js')
    })
    .returningAll()
    .executeTakeFirstOrThrow()

  await db
    .insertInto('chapters')
    .values({
      course_id: course.id,
      name: 'Estrutura da aplicação',
      is_published: 0,
      position: 0,
      module_id: module.id,
      slug: createSlugFromText('Estrutura da aplicação')
    })
    .returningAll()
    .executeTakeFirstOrThrow()

  // await db
  //   .insertInto('lessons')
  //   .values({
  //     course_id: course.id,
  //     asset_id: '',
  //     chapter_id: fundamentals.id,
  //     description: 'aeiojdaoijda',
  //     playback_id: '',
  //     position: 0,
  //     slug: createSlugFromText('Introdução'),
  //     title: 'Introdução',
  //     video_url: ''
  //   })
  //   .executeTakeFirstOrThrow()
}

seedDatabase()
