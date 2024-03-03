import { response } from '../../network/response.js'
import { hashPassword } from '../../utilis/hast.js'
import { consults } from '../../db/consults.js'

export const registryUserClient = async (req, res) => {
  try {
    const { password, password_conf, email, country } = req.body
    if (password !== password_conf) {
      response.error(
        res,
        'Password and password confirmation do not match',
        400
      )
    }
    const hashedPassword = await hashPassword(password)
    const responseDB = await consults.getUser(email)
    if (responseDB.length === 1) {
      response.error(res, 'User already exists', 400)
    }

    const responseDBCreate = await consults.createUserClient(email, hashedPassword, country)
    response.success(res, 'Password hashed', {hashedPassword, email})
  } catch (error) {
    response.error(res, error.message)
  }
}
