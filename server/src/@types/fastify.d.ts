import '@fastify/jwt'

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    user: {
      role: 'USER' | 'ADMIN' | 'TEACHER'
      sub: number
    }
  }
}
