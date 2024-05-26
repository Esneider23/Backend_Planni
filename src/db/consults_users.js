import { db } from './conect.js'
import { compareHash } from '../utils/bcrypt/compareHash.js'
import {name, generateRandomUsername} from '../utils/users.js/users.js'

const client = db.client

const getUser = async (email) => {
  try {
    const query = 'SELECT * FROM users WHERE email = $1'
    const values = [email]
    const { rows } = await client.query(query, values)
    return rows
  } catch (error) {
    // Manejar el error
    console.error('[db] Error al consultar usuario:', error.message)
    throw error // Lanzar el error nuevamente para que se maneje en el código que llama a esta función
  }
}


const createUserClient = async (email, password, id_country) => {
  try {
    const nameUser = await name(email)
    const username = generateRandomUsername(email)
    const query = {
    text: 'INSERT INTO users (username, name_user, id_country, email, password, id_rol) VALUES ($1, $2, $3, $4, $5, $6)',
    values: [username, nameUser, id_country, email, password, '3']}
    const { rowCount } = await client.query(query)
    return rowCount
  } catch (error) {
    // Manejar el error
    console.error('[db] Error al crear usuario:', error.message)
    throw error // Lanzar el error nuevamente para que se maneje en el código que llama a esta función
  }
}

const createUserOtherType = async (
  username,
  name_user,
  lastname_user,
  id_country,
  email,
  password,
  phone,
  address,
  id_rol
) => {
  try {
    const query =  { 
      text:'INSERT INTO users (username, name_user, lastname_user, id_country, email, password, phone, address, id_rol) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      values: [
      username,
      name_user,
      lastname_user,
      id_country,
      email,
      password,
      phone,
      address,
      id_rol
    ]
    }
    const { rowCount } = await client.query(query)
    console.log('[db] Created user', rowCount)
    return rowCount
  } catch (error) {
    // Manejar el error
    console.error('[db] Error al crear usuario:', error.message)
    throw error // Lanzar el error nuevamente para que se maneje en el código que llama a esta función
  }
}

// Codigo de api auth planni

const getUserByUsername = async (username) => {
  const query = {
    text: 'SELECT id_users, username, name_user, lastname_user, id_country, email FROM users WHERE username = $1',
    values: [username]
  }
  const { rows } = await client.query(query)
  return rows[0] || null
}

const validateAccount = async (email, password) => {
  const query = {
    text: 'SELECT * FROM users WHERE email = $1',
    values: [email]
  }

  const { rows } = await client.query(query)

  if (rows.length === 0) return null

  const user = rows[0]

  const passMatches = await compareHash(password, user.password)

  if (passMatches) return user
  else return null
}

const validateUser = async (username, password) => {
  const query = {
    text: 'SELECT id_users, username, password FROM users WHERE username = $1',
    values: [username]
  }
  const { rows } = await client.query(query)

  if (rows.length === 0) {
    return null // No existe
  }

  const storedPassword = rows[0].password
  const passMatches = await compareHash(password, storedPassword)

  if (passMatches) {
    return true
  } else {
    return null // No coinciden
  }
}

const deleteUser = async (id) => {
  const query = {
    text: 'DELETE FROM users WHERE id_users = $1',
    values: [id]
  }

}
export const consults = {
  getUser,
  createUserClient,
  createUserOtherType,
  getUserByUsername,
  validateUser,
  validateAccount
}
