import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { db } from '@/db'
import { verifyJwt } from '@/middlewares/verify-jwt'
import { BadRequest } from '@/errors/bad-request'
import { isUserOwnerOfTheCourse } from '@/utils/is-user-owner-of-the-course'
import { verifyUserRole } from '@/middlewares/verify-user-role'
import { createSlugFromText } from '@/utils/create-slug-from-text'

export async function createChapter(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)
  app.addHook('onRequest', verifyUserRole('TEACHER'))

  app.withTypeProvider<ZodTypeProvider>().post(
    '/chapters',
    {
      schema: {
        summary: 'Create an chapter',
        tags: ['chapters'],
        body: z.object({
          name: z.string(),
          course_id: z.number(),
          module_id: z.number()
        }),
        response: {
          201: z.object({
            id: z.number()
          })
        }
      }
    },
    async (request, reply) => {
      const { course_id, name, module_id } = request.body

      const isUserCourseOwner = await isUserOwnerOfTheCourse({
        courseId: course_id,
        userId: request.user.sub
      })

      if (!isUserCourseOwner) {
        throw new BadRequest('You are not the creator of this course.')
      }

      const chapters = await db
        .selectFrom('chapters')
        .select(['position'])
        .where(eb =>
          eb.and({
            course_id,
            module_id
          })
        )
        .execute()

      const position =
        chapters.length === 0
          ? 0
          : Math.max(...chapters.map(item => item.position ?? 0)) + 1

      const chapter = await db
        .insertInto('chapters')
        .values({
          name,
          course_id,
          position,
          module_id,
          slug: createSlugFromText(name)
        })
        .returning('id')
        .executeTakeFirstOrThrow()

      return reply.status(201).send({
        id: chapter.id
      })
    }
  )
}
