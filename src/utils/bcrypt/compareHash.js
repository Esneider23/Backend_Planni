import { env } from '../../options/env.js'
import bcrypt from 'bcrypt'

console.log(env.SALT_ROUNDS)

const compareHash = async (passForm, passDB) => {
  const passMatches = await bcrypt.compare(passForm, passDB)
  return passMatches
}

export { compareHash }
