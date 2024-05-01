import { BadRequest } from '@/errors/bad-request'
import { createUploadthing } from 'uploadthing/fastify'

const f = createUploadthing()

// .middleware(async ({ req }) => {
//   if (!req.user.sub) {
//     throw new BadRequest()
//   }

//   await req.jwtVerify()

//   if (req.user.role !== 'ADMIN') {
//     throw new BadRequest()
//   }

//   return { userId: req.user.sub }
// })

export const uploadRouter = {
  lessonVideo: f({
    video: {
      maxFileSize: '512GB',
      maxFileCount: 1
    }
  })
    .onUploadError(async error => {
      console.error('[UPLOADTHING]', error)
      // await UTApi.deleteFiles(error.fileKey)
    })
    .onUploadComplete(data => {
      console.log('upload completed', data)
    }),
  courseImage: f({
    image: {
      maxFileSize: '16MB',
      maxFileCount: 2
    }
  })
    .onUploadError(async error => {
      console.error('[UPLOADTHING]', error)
      // await UTApi.deleteFiles(error.fileKey)
    })
    .onUploadComplete(data => {
      console.log('upload completed', data)
    })
}

export type OurFileRouter = typeof uploadRouter
