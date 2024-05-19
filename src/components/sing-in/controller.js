import { generateToken, newToken } from '../../utils/jwt/generateToken.js'
import { consults } from '../../db/consults_users.js'
import { response } from '../../network/response.js'

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

export const signInNew = async (req, res) => {
  const { email, password } = req.body

  try {
    if (!email || !password)
      return response.error(res, 'Faltan parametros.', 400)

    const user = await consults.validateAccount(email, password)

    if (user === null) {
      return response.error(res, 'Contraseña o usuario inconrrectos', 401)
    }

    console.log('usuario', user)

    const token = newToken({ userId: user.id_users, rolId: user.id_rol })

    const data = {
      name: user.name_user,
      email: user.email,
      userId: user.id_users,
      rolId: user.id_rol,
      token
    }

    response.success(res, 'Inicio de sesión existoso.', data)
  } catch (err) {
    console.log(err)
    response.error(res, 'Algo malo paso.', 500)
  }
}
