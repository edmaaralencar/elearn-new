import { env } from '@/env'
import Mux from '@mux/mux-node'

export const mux = new Mux({
  tokenSecret: env.MUX_SECRET_KEY,
  tokenId: env.MUX_APP_ID
})
