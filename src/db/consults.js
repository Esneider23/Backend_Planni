import { db } from './conect.js'
import { compareHash } from '../utils/bcrypt/compareHash.js'

const client = db.client

const getUser = async (email) => {
  try {
    const query = 'SELECT * FROM users WHERE email = $1'
    const values = [email]
    const { rows } = await client.query(query, values)
    console.log('[db] Consulted user', rows[0])
    return rows
  } catch (error) {
    // Manejar el error
    console.error('[db] Error al consultar usuario:', error.message)
    throw error // Lanzar el error nuevamente para que se maneje en el código que llama a esta función
  }
}

const name = (email) => {
  try {
    // Dividir la dirección de correo electrónico en dos partes usando el símbolo "@"
    const parts = email.split('@')

    // Extraer la parte antes del símbolo "@" (el nombre de usuario)
    const username = parts[0]

    return username
  } catch (error) {
    // Manejar errores, si es necesario
    console.error('Error al extraer el nombre de usuario:', error)
    return null // O manejar el error de alguna otra manera
  }
}

const generateRandomUsername = (email) => {
  try {
    // Dividir la dirección de correo electrónico en dos partes usando el símbolo "@"
    const parts = email.split('@')

    // Extraer la parte antes del símbolo "@" (el nombre de usuario)
    const username = parts[0]

    // Obtener la longitud del nombre de usuario
    const usernameLength = username.length

    // Generar una cadena aleatoria de longitud restante
    const randomChars =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let randomUsername = ''
    for (let i = 0; i < 10 - usernameLength; i++) {
      randomUsername += randomChars.charAt(
        Math.floor(Math.random() * randomChars.length)
      )
    }

    // Combinar el nombre de usuario extraído con la cadena aleatoria
    const finalUsername = username + randomUsername

    return finalUsername
  } catch (error) {
    // Manejar errores, si es necesario
    console.error('Error al generar el nombre de usuario aleatorio:', error)
    return null // O manejar el error de alguna otra manera
  }
}

const createUserClient = async (email, password, country) => {
  try {
    const nameUser = await name(email)
    const username = await generateRandomUsername(email)
    const query =
      'INSERT INTO users (username, name_user, id_country, email, password, id_rol) VALUES ($1, $2, $3, $4, $5, $6)'
    const values = [username, nameUser, country, email, password, '3']
    const { rowCount } = await client.query(query, values)
    console.log('[db] Created user', rowCount)
    return rowCount
  } catch (error) {
    // Manejar el error
    console.error('[db] Error al crear usuario:', error.message)
    throw error // Lanzar el error nuevamente para que se maneje en el código que llama a esta función
  }
}

const createUserOtherType = async (
  username,
  nameUser,
  lastnameUser,
  idCountry,
  email,
  password,
  phone,
  addrees,
  idRol
) => {
  try {
    const query =
      'INSERT INTO users (username, name_user, lastname_user, id_country, email, password, phone, addrees, id_rol) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)'
    const values = [
      username,
      nameUser,
      lastnameUser,
      idCountry,
      email,
      password,
      phone,
      addrees,
      idRol
    ]
    const { rowCount } = await client.query(query, values)
    console.log('[db] Created user', rowCount)
    return rowCount
  } catch (error) {
    // Manejar el error
    console.error('[db] Error al crear usuario:', error.message)
    throw error // Lanzar el error nuevamente para que se maneje en el código que llama a esta función
  }
}

const consultsSupplier = async (nameSupplier, email, nitSupplier) => {
  try {
    const query =
      'SELECT * FROM suppliers WHERE name_supplier = $1 OR email = $2 OR nit_supplier = $3'
    const values = [nameSupplier, email, nitSupplier]
    const { rows } = await client.query(query, values)
    console.log('[db] Consulted supplier', rows[0])
    return rows
  } catch (error) {
    console.error('[db] Error al consultar el proveedor:', error.message)
    throw error
  }
}

// Codigo de api auth planni

const createUser = async (
  username,
  name,
  lastName,
  country,
  email,
  password
) => {
  const query = {
    text: 'INSERT INTO users (username, name_user, lastname_user, id_country, email, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_users',
    values: [username, name, lastName, country, email, password]
  }
  const { rows } = await client.query(query)
  return rows[0].id_users
}

const getUserByUsername = async (username) => {
  const query = {
    text: 'SELECT id_users, username, name_user, lastname_user, id_country, email FROM users WHERE username = $1',
    values: [username]
  }
  const { rows } = await client.query(query)
  return rows[0] || null
}

const getUserById = async (id) => {
  const query = {
    text: 'SELECT id_users, username, name_user, lastname_user, id_country, email FROM users WHERE id_users = $1',
    values: [id]
  }
  const { rows } = await client.query(query)
  return rows[0] || null
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

// Obtener usuario por email





export const consults = {
  getUser,
  createUserClient,
  createUserOtherType,
  consultsSupplier,
  // Codigo de la api auth planni
  createUser,
  getUserByUsername,
  getUserById,
  validateUser
}
