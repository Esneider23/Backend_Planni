import pkg from 'pg'
import { env } from '../options/env.js'

const client = new pkg.Client({
  host: env.DB_HOST,
  user: env.DB_USER,
  port: env.DB_PORT,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
  ssl: {
    rejectUnauthorized: false
  }
})

const connect = async () => {
  await client.connect()
  console.log('[db] Connected to database')
}

export const db = {
  connect,
  client
}
