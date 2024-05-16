import { api } from '@/lib/axios'

type Params = {
  name: string
  email: string
}

export async function registerTeacher({ email, name }: Params) {
  return api.post('/users/teachers', {
    email,
    name
  })
}
