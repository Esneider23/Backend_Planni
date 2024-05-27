import { newToken } from '../../utils/jwt/generateToken.js'
import { consults } from '../../db/consults_users.js'
import { response } from '../../network/response.js'

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
