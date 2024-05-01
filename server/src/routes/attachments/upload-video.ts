import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { verifyJwt } from '@/middlewares/verify-jwt'
import { verifyUserRole } from '@/middlewares/verify-user-role'
import fastifyMultipart from '@fastify/multipart'
import { BadRequest } from '@/errors/bad-request'
import { uploadProvider } from '@/providers/upload-provider'

export async function uploadVideoAttachment(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)
  app.addHook('onRequest', verifyUserRole('TEACHER'))

  app.register(fastifyMultipart, {
    limits: {
      fileSize: 1 * 1000 * 1024 * 1024, //1gb
      files: 1 // 1gb
    }
  })

  app.withTypeProvider<ZodTypeProvider>().post(
    '/attachments/video',
    {
      schema: {
        summary: 'Upload video attachment',
        tags: ['attachments'],
        response: {
          201: z.object({
            url: z.string()
          })
        }
      }
    },
    async (request, reply) => {
      const video = await request.file()

      if (!video) {
        throw new BadRequest('Video is mandatory.')
      }

      if (
        !uploadProvider.filterExtension(
          ['video/mp3', 'video/quicktime', 'video/mp4'],
          video.mimetype
        )
      ) {
        throw new BadRequest(`Invalid file type ${video.mimetype}`)
      }

      const videoBuffer = await video.toBuffer()

      const { url } = await uploadProvider.upload({
        fileName: video.filename,
        body: videoBuffer,
        fileType: video.mimetype
      })

      return reply.status(201).send({
        url
      })
    }
  )
}
