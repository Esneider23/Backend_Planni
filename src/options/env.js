import 'dotenv/config'

export const env = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  STAGE: process.env.STAGE,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_DATABASE,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USERNAME: process.env.DB_USER,
  HOST_API: process.env.HOST_API,
  JWT_SECRET: process.env.SECRET_KEY,
  SSL_REJECT_UNAUTHORIZED: process.env.SSL_REJECT_UNAUTHORIZED,
  TIME_TOKEN: process.env.TIME_TOKEN,
  SALT_ROUNDS: process.env.SALT_ROUNDS,
  SECRET_KEY: process.env.SECRET_KEY
}
