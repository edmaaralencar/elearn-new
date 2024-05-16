import { api } from '@/lib/axios'

type Response = {
  teachers: {
    id: number
    name: string
    email: string
    created_at: string
  }[]
}

export async function getTeachers() {
  const { data } = await api.get<Response>('/users/teachers')

  return data.teachers
}
