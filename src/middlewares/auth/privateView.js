import { env } from '../../options/env.js'
import jwt from 'jsonwebtoken'

const SECRET_KEY = env.SECRET_KEY

// Middleware para verificar la validez del token
export const privateView = (req, res, next) => {
  const token = req.cookies.token

  if (!token) {
    return res.status(401).json({ message: 'Usuario no autorizado' })
  }

  try {
    // Verifica el token y extrae la información del usuario si es válido
    const user = jwt.verify(token, SECRET_KEY)
    req.user = user // Almacena la información del usuario en la solicitud para su uso posterior
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Token no válido' })
  }
}
