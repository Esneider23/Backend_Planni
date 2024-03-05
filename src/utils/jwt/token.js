const jwt = require('jsonwebtoken')
import { env } from '../options/env.js'

const SECRET_KEY = env.SECRET_KEY
const TIME_TOKEN = Number(env.TIME_TOKEN)

const generateToken = (res, id, username) => {
  const expiration = TIME_TOKEN
  const token = jwt.sign({ id, username }, SECRET_KEY, {
    expiresIn: expiration,
  })

  return token
}

module.exports = generateToken
