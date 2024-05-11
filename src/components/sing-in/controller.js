import { generateToken } from '../../utils/jwt/generateToken.js'
import { consults } from '../../db/consults_users.js'

export const signIn = async (req, res) => {
  const { username, password } = req.body

  try {
    const data = await consults.validateUser(username, password)
    if (data === true) {
      const userData = await consults.getUserByUsername(username)
      const token = generateToken(userData.id, username)
      res.status(201).json({ token, message: 'Inicio de sesion exitosamente' })
    } else {
      res
        .status(401)
        .json({ status: 401, msg: 'Contraseña o usuario incorrectos' })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
