import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { FastifyInstance } from 'fastify'

import { db } from '@/db'

import { BadRequest } from '@/errors/bad-request'

export async function getCourse(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/courses/:id',
    {
      schema: {
        summary: 'Get an course',
        tags: ['courses'],
        params: z.object({
          id: z.string()
        }),
        response: {
          201: z.object({
            course: z
              .object({
                id: z.number(),
                title: z.string(),
                description: z.string().nullable(),
                coverImage: z.string().nullable(),
                is_published: z.boolean(),
                created_by: z.number(),
                technology: z.string(),
                slug: z.string()
              })
              .nullable(),
            lessons: z.array(
              z.object({
                asset_id: z.string(),
                course_id: z.number(),
                description: z.string(),
                module_id: z.number(),
                id: z.number(),
                playback_id: z.string(),
                title: z.string(),
                video_url: z.string(),
                slug: z.string(),
                duration: z.number()
              })
            ),
            modules: z.array(
              z.object({
                title: z.string(),
                description: z.string(),
                type: z.string(),
                id: z.number(),
                position: z.number(),
                course_id: z.number(),
                is_published: z.boolean(),
                slug: z.string()
              })
            )
          })
        }
      }
    },
    async (request, reply) => {
      const { id } = request.params

      const course = await db
        .selectFrom('courses')
        .selectAll()
        .where('id', '==', Number(id))
        .executeTakeFirst()

      if (!course) {
        throw new BadRequest('Course does not exists.')
      }

      const lessons = await db
        .selectFrom('lessons')
        .selectAll()
        .where('course_id', '==', course.id)
        .execute()

      const modules = await db
        .selectFrom('modules')
        .selectAll()
        .where('course_id', '==', course.id)
        .execute()

      return reply.status(201).send({
        lessons: lessons.map(item => ({
          ...item,
          duration: Number(item.duration)
        })),
        course: {
          ...course,
          is_published: course.is_published === 0 ? false : true
        },
        modules: modules.map(module => ({
          ...module,
          is_published: module.is_published === 1
        }))
      })
    }
  )
}
