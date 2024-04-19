import { api } from '@/lib/axios'

type SignUpParams = {
  email: string
  password: string
  name: string
}

export async function signUp({ email, password, name }: SignUpParams) {
  return api.post('/users', {
    email,
    password,
    name
  })
}
