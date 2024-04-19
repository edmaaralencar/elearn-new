import { LucideIcon } from 'lucide-react'
import { Header } from '@/components/header'
import { Sidebar } from '@/components/sidebar'
import { Loading } from '@/components/ui/loading'
import { api } from '@/lib/axios'
import { isAxiosError } from 'axios'
import { useLayoutEffect, useState } from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import { useProfile } from '@/api/hooks/use-profile'

type AppWrapperProps = {
  items: {
    label: string
    pathname: string
    Icon: LucideIcon
  }[]
  allowedRoles: string[]
}
export function AppWrapper({ items, allowedRoles }: AppWrapperProps) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const { data: profile } = useProfile()

  console.log(profile?.role, allowedRoles)

  useLayoutEffect(() => {
    setIsLoading(true)
    const interceptorId = api.interceptors.response.use(
      response => {
        setIsLoading(false)
        return response
      },
      error => {
        if (isAxiosError(error)) {
          const status = error.response?.status
          const message = error.response?.data.message

          if (status === 401 && message === 'Unauthenticated.') {
            navigate('/sign-in', {
              replace: true
            })
          }
        }

        setIsLoading(false)
        return Promise.reject(error)
      }
    )

    // Clean up the side effect when the component unmounts
    return () => {
      api.interceptors.response.eject(interceptorId)
    }
  }, [navigate])

  if (isLoading || !profile) {
    return (
      <div className="h-screen w-screen grid place-items-center">
        <Loading className="w-16 h-16" />
      </div>
    )
  }

  if (!allowedRoles.includes(String(profile?.role))) {
    if (profile?.role === 'USER') {
      return <Navigate to="/app" />
    }

    if (profile?.role === 'TEACHER') {
      return <Navigate to="/teachers" />
    }

    return <Navigate to="/sign-in" />
  }

  return (
    <main className="flex flex-col">
      <Header />
      <div className="grid h-full w-full md:grid-cols-[190px_1fr] lg:grid-cols-[260px_1fr]">
        <Sidebar items={items} />
        <section className="h-full w-full overflow-y-scroll p-8">
          <Outlet />
        </section>
      </div>
    </main>
  )
}
