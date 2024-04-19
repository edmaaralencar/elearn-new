import '@fastify/jwt'

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    user: {
      role: 'USER' | 'ADMIN'
      sub: number
    }
  }
}
