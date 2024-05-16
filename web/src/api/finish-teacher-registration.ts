import { api } from '@/lib/axios'

type Params = {
  email: string
  code: number
  password: string
}

export async function finishTeacherRegistration({
  email,
  code,
  password
}: Params) {
  return api.post('/users/teachers/finish', {
    email,
    code,
    password
  })
}
