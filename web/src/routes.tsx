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
import { AdminTeachers } from './pages/admin/teachers'
import { GeneratePassword } from './pages/auth/generate-password'
import { Home } from './pages/home'
import { Checkout } from './pages/checkout'
import { AppForums } from './pages/app/forums'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/checkout',
    element: <Checkout />
  },
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
      },
      {
        path: '/generate-password',
        element: <GeneratePassword />
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
      },
      {
        path: '/app/forums',
        element: <AppForums />
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
      },
      {
        path: '/admin/teachers',
        element: <AdminTeachers />
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
