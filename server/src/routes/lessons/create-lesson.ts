import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { db } from '@/db'
import { mux } from '@/lib/mux'
import { verifyJwt } from '@/middlewares/verify-jwt'
import { verifyUserRole } from '@/middlewares/verify-user-role'
import { isUserOwnerOfTheCourse } from '@/utils/is-user-owner-of-the-course'
import { BadRequest } from '@/errors/bad-request'
import { env } from '@/env'
import { createSlugFromText } from '@/utils/create-slug-from-text'

export async function createLesson(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)
  app.addHook('onRequest', verifyUserRole('TEACHER'))

  app.withTypeProvider<ZodTypeProvider>().post(
    '/lessons',
    {
      schema: {
        summary: 'Create an lesson',
        tags: ['lessons'],
        body: z.object({
          title: z.string(),
          course_id: z.number(),
          chapter_id: z.number(),
          description: z.string(),
          video_url: z.string(),
          duration: z.number()
        }),
        response: {
          201: z.object({
            id: z.number()
          })
        }
      }
    },
    async (request, reply) => {
      const { course_id, description, chapter_id, title, video_url, duration } =
        request.body

      const isUserCourseOwner = await isUserOwnerOfTheCourse({
        courseId: course_id,
        userId: request.user.sub
      })

      if (!isUserCourseOwner) {
        throw new BadRequest('You are not the creator of this course.')
      }

      const chapterExists = await db
        .selectFrom('chapters')
        .select(['id', 'module_id'])
        .executeTakeFirst()

      if (!chapterExists) {
        throw new BadRequest('Chapter does not exists.')
      }

      const muxData = await mux.video.assets.create({
        input: [{ url: `${env.CLOUDFARE_ENDPOINT_URL}/${video_url}` }],
        playback_policy: ['public'],
        encoding_tier: 'baseline'
      })

      const lessons = await db
        .selectFrom('lessons')
        .select(['position'])
        .where('chapter_id', '==', chapter_id)
        .execute()

      const position =
        lessons.length === 0
          ? 0
          : Math.max(...lessons.map(item => item.position ?? 0)) + 1

      const lesson = await db
        .insertInto('lessons')
        .values({
          title,
          description,
          chapter_id,
          course_id,
          video_url,
          position,
          module_id: chapterExists.module_id,
          duration: String(duration),
          asset_id: muxData.id,
          playback_id: muxData.playback_ids ? muxData.playback_ids[0].id : '',
          slug: createSlugFromText(title)
        })
        .returning('id')
        .executeTakeFirst()

      return reply.status(201).send({
        id: Number(lesson?.id)
      })
    }
  )
}
