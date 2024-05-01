import { createBrowserRouter } from 'react-router-dom'
import { AuthLayout } from './pages/_layouts/auth'
import { SignIn } from './pages/auth/sign-in'
import { AppLayout } from './pages/_layouts/app'
import { AppHome } from './pages/app'
import { SignUp } from './pages/auth/sign-up'
import { VerificationCode } from './pages/auth/verification-code'
import { AdminLayout } from './pages/_layouts/admin'
import { TeachersLayout } from './pages/_layouts/teachers'
import { TeachersHome } from './pages/teachers'
import { TeachersCourses } from './pages/teachers/courses'
import { EditCourse } from './pages/teachers/edit-course'
import { AppCourses } from './pages/app/courses'
import { AppCourse } from './pages/app/course'
import { AppModule } from './pages/app/module'
import { AppLesson } from './pages/app/lesson'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        path: '/sign-in',
        element: <SignIn />
      },
      {
        path: '/sign-up',
        element: <SignUp />
      },
      {
        path: '/verification-code',
        element: <VerificationCode />
      }
    ]
  },
  {
    path: '/app',
    element: <AppLayout />,
    children: [
      {
        path: '/app',
        element: <AppHome />
      },
      {
        path: '/app/courses',
        element: <AppCourses />
      },
      {
        path: '/app/courses/:id',
        element: <AppCourse />
      },
      {
        path: '/app/modules/:id',
        element: <AppModule />
      },
      {
        path: '/app/modules/:id/lessons/:slug',
        element: <AppLesson />
      }
    ]
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        path: '*',
        element: <AppHome />
      }
    ]
  },
  {
    path: '/teachers',
    element: <TeachersLayout />,
    children: [
      {
        path: '',
        element: <TeachersHome />
      },
      {
        path: 'courses',
        element: <TeachersCourses />
      },
      {
        path: '/teachers/courses/:id',
        element: <EditCourse />
      }
    ]
  }
])
