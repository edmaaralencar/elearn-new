import fastifyCookie from '@fastify/cookie'
import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import fastify from 'fastify'
import {
  ZodTypeProvider,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler
} from 'fastify-type-provider-zod'
import { env } from './env'
import { errorHandler } from './error-handler'
import { authenticate } from './routes/auth/authenticate'
import { createCourse } from './routes/courses/create-course'
import { getCourse } from './routes/courses/get-course'
import { getCoursesByTeacherid } from './routes/courses/get-courses-by-teacher-id'
import { profile } from './routes/auth/profile'
import { registerUser } from './routes/auth/register-user'
import { signOut } from './routes/auth/sign-out'
import { updateCourse } from './routes/courses/update-course'
import { validateVerificationCode } from './routes/auth/validate-verification-code'
import { createLesson } from './routes/lessons/create-lesson'
import { reorderList } from './routes/reorder-list'
import { uploadVideoAttachment } from './routes/attachments/upload-video'
import { uploadImageAttachment } from './routes/attachments/upload-image'
import { deleteLesson } from './routes/lessons/delete-lesson'
import { getCourses } from './routes/courses/get-courses'
import { getModulesByCourse } from './routes/modules/get-modules-by-course'
import { createModule } from './routes/modules/create-module'
import { deleteModule } from './routes/modules/delete-module'
import { getCourseDetails } from './routes/courses/get-course-details'
import { getLesson } from './routes/lessons/get-lesson'
import { saveUserProgress } from './routes/users-progress/save-user-progress'
import { getUserProgressByCourse } from './routes/users-progress/get-user-progress-by-course'
import { getLessonsByModule } from './routes/lessons/get-lessons-by-module'
import { getTeachers } from './routes/auth/get-teachers'
import { registerTeacher } from './routes/auth/register-teacher'
import { finishTeacherRegistration } from './routes/auth/finish-teacher-registration'
import { getSubscription } from './routes/subscriptions/get-subscription'

export const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'token',
    signed: false
  },
  sign: {
    expiresIn: '1d'
  }
})

app.register(fastifyCors, {
  origin: ['http://localhost:5173'],
  credentials: true,
  allowedHeaders: [
    'content-type',
    'X-Uploadthing-Package',
    'X-Uploadthing-Version'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS']
})

app.register(fastifyCookie)

app.register(fastifySwagger, {
  swagger: {
    consumes: ['application/json'],
    produces: ['application/json'],
    info: {
      title: 'ELearn',
      description:
        'Especificações da API para o back-end da aplicação ELearn construída como um projeto pessoal.',
      version: '1.0.0'
    }
  },
  transform: jsonSchemaTransform
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs'
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(registerUser)
app.register(authenticate)
app.register(profile)
app.register(signOut)
app.register(getTeachers)
app.register(registerTeacher)
app.register(finishTeacherRegistration)

app.register(validateVerificationCode)
app.register(createCourse)
app.register(getCourse)
app.register(updateCourse)
app.register(getCoursesByTeacherid)
app.register(getCourses)
app.register(getCourseDetails)

app.register(getModulesByCourse)
app.register(createModule)
app.register(deleteModule)

app.register(createLesson)
app.register(deleteLesson)
app.register(getLesson)
app.register(getLessonsByModule)

app.register(reorderList)
app.register(uploadVideoAttachment)
app.register(uploadImageAttachment)

app.register(saveUserProgress)
app.register(getUserProgressByCourse)

app.register(getSubscription)

app.setErrorHandler(errorHandler)

app.listen({ port: env.PORT, host: '0.0.0.0' }).then(() => {
  console.log('HTTP server running!')
})
