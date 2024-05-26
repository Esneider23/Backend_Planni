import { db } from '../db/connect.js'
import { env } from '../options/env.js'

const server = async (app) => {
  console.log('[Server] Starting server...')
  await db.connect()

  app.listen(env.PORT, () => {
    console.log(`[Server] Server listening on ${env.HOST_API}`)
  })
}

export { server }
