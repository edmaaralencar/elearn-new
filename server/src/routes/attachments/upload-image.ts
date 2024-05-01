import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { FastifyInstance } from 'fastify'
import { verifyJwt } from '@/middlewares/verify-jwt'
import fastifyMultipart from '@fastify/multipart'
import { BadRequest } from '@/errors/bad-request'
import { uploadProvider } from '@/providers/upload-provider'

export async function uploadImageAttachment(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.register(fastifyMultipart, {
    limits: {
      files: 1,
      fileSize: 5 * 1024 * 1024 // 5mb,
    }
  })

  app.withTypeProvider<ZodTypeProvider>().post(
    '/attachments/images',
    {
      schema: {
        summary: 'Upload image attachment',
        tags: ['attachments'],
        response: {
          201: z.object({
            url: z.string()
          })
        }
      }
    },
    async (request, reply) => {
      const file = await request.file()

      if (!file) {
        throw new BadRequest('file is mandatory.')
      }

      if (
        !uploadProvider.filterExtension(
          ['image/png', 'image/jpeg', 'image/jpg'],
          file.mimetype
        )
      ) {
        throw new BadRequest(`Invalid file type ${file.mimetype}`)
      }

      const fileBuffer = await file.toBuffer()

      const { url } = await uploadProvider.upload({
        fileName: file.filename,
        body: fileBuffer,
        fileType: file.mimetype
      })

      return reply.status(201).send({
        url
      })
    }
  )
}
