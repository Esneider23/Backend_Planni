import { env } from '../../options/env.js'
import jwt from 'jsonwebtoken'

const SECRET_KEY = env.SECRET_KEY
const TIME_TOKEN = Number(env.TIME_TOKEN)

const generateToken = (id, username) => {
  const expiration = TIME_TOKEN
  const token = jwt.sign({ id, username }, SECRET_KEY, {
    expiresIn: expiration
  })

  return token
}

const newToken = (payload) => {
  return jwt.sign(payload, SECRET_KEY, {
    expiresIn: TIME_TOKEN
  })
}

export { generateToken, newToken }
