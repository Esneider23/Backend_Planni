import pkg from 'pg'

const client = new pkg.Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: {
    rejectUnauthorized: process.env.SSL_REJECT_UNAUTHORIZED
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
