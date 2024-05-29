import { db } from './connect.js'
import { compareHash } from '../utils/bcrypt/compareHash.js'
import { name, generateRandomUsername } from '../utils/users.js/users.js'
import { hashPassword } from '../utils/bcrypt/hashPassword.js'

const client = db.client

const getUser = async (email) => {
  try {
    const query = {
      text: 'SELECT * FROM users WHERE email = $1',
      values: [email]
    }
    const { rows } = await client.query(query)
    return rows
  } catch (error) {
    // Manejar el error
    console.error('[db] Error al consultar usuario:', error.message)
    throw error // Lanzar el error nuevamente para que se maneje en el código que llama a esta función
  }
}

const getUserAll = async () => {
  try {
    const query = {
      text: 'SELECT users.id_users, users.username, users.name_user, users.lastname_user, users.id_country, users.email, users.password, users.phone, users.address, users.id_rol, rol.name_rol, country.name_country FROM users JOIN rol ON users.id_rol = rol.id_rol JOIN country on users.id_country = country.id_country'
    }
    const { rows } = await client.query(query)
    return rows
  } catch (error) {
    // Manejar el error
    console.error('[db] Error al consultar los usuarios:', error.message)
    throw error // Lanzar el error nuevamente para que se maneje en el código que llama a esta función
  }
}

const getFilterByRol = async (rol) => {
  try {
    const query = {
      text: 'SELECT users.id_users, users.username, users.name_user, users.lastname_user, users.id_country, users.email, users.password, users.phone, users.address, users.id_rol, rol.name_rol, country.name_country FROM users JOIN rol ON users.id_rol = rol.id_rol JOIN country on users.id_country = country.id_country WHERE rol.name_rol = $1',
      values: [rol]
    }
    const { rows } = await client.query(query)
    return rows || null
  } catch (error) {
    console.error(
      '[db] Error al consultar los usuarios por rol:',
      error.message
    )
    throw error
  }
}

const getFilterByUsername = async (name_user) => {
  try {
    const query = {
      text: 'SELECT users.id_users, users.username, users.name_user, users.lastname_user, users.id_country, users.email, users.password, users.phone, users.address, users.id_rol, rol.name_rol, country.name_country FROM users JOIN rol ON users.id_rol = rol.id_rol JOIN country on users.id_country = country.id_country WHERE users.name_user = $1',
      values: [name_user]
    }
    const { rows } = await client.query(query)
    return rows // Retorna las filas obtenidas
  } catch (error) {
    console.error(
      '[db] Error al consultar los usuarios por rol:',
      error.message
    )
    throw error
  }
}

const createUserClient = async (email, password, id_country) => {
  try {
    const nameUser = await name(email)
    const username = generateRandomUsername(email)
    const query = {
      text: 'INSERT INTO users (username, name_user, id_country, email, password, id_rol) VALUES ($1, $2, $3, $4, $5, $6)',
      values: [username, nameUser, id_country, email, password, '3']
    }
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
    const query = {
      text: 'INSERT INTO users (username, name_user, lastname_user, id_country, email, password, phone, address, id_rol) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
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
  try {
    const query = {
      text: 'DELETE FROM users WHERE id_users = $1',
      values: [id]
    }
    await client.query(query)
  } catch (error) {
    console.error('Error deleting user:', error)
    throw error
  }
}

const updateUser = async (id, userData) => {
  const {
    username,
    name_user,
    lastname_user,
    id_country,
    email,
    password,
    phone,
    address,
    id_rol,
    old_email
  } = userData
  console.log(userData)
  try {
    const existingUser = await getUser(old_email)

    // Validar si el email ya existe en otro usuario
    if (!existingUser.length === 1) {
      return 'Usuario no existe'
    }

    // Hashear la contraseña antes de actualizar
    const hashedPassword =
      password != existingUser[0].password
        ? await hashPassword(password)
        : password

    const vals = [
      username,
      name_user,
      lastname_user,
      id_country,
      email,
      hashedPassword,
      phone,
      address,
      id_rol,
      id
    ]
    console.log(vals)

    const query = {
      text: 'UPDATE users SET username = $1, name_user = $2, lastname_user = $3, id_country = $4, email = $5, password = $6, phone = $7, address = $8, id_rol = $9 WHERE id_users = $10 RETURNING *',
      values: [
        username,
        name_user,
        lastname_user,
        id_country,
        email,
        hashedPassword,
        phone,
        address,
        id_rol,
        id
      ]
    }
    const { rows } = await client.query(query)
    console.log('[db] Updated user', rows[0])
    return rows[0]
  } catch (error) {
    console.error('[db] Error al actualizar usuario:', error.message)
    throw error
  }
}

const getHistoryBuy = async (idUser) => {
  try {
    const query = {
      text: `
      SELECT 
        bp.id_buy_package,
        bp.id_users,
        p.id_package,
        h.id_hotels,
        h.name_hotels,
        h.description_hotels,
        h.price AS hotel_price,
        h.imageurl AS hotel_image,
        r.id_restaurant,
        r.name_restaurant,
        r.description_restaurant,
        r.price AS restaurant_price,
        a1.id_attractions AS attraction1_id,
        a1.name_attractions AS attraction1_name,
        a1.description_attractions AS attraction1_description,
        a2.id_attractions AS attraction2_id,
        a2.name_attractions AS attraction2_name,
        a2.description_attractions AS attraction2_description,
        p.price_package
      FROM 
        buy_package bp
      JOIN 
        "package" p ON bp.id_package = p.id_package
      LEFT JOIN 
        hotels h ON p.id_hotels = h.id_hotels
      LEFT JOIN 
        restaurant r ON p.id_restaurant = r.id_restaurant
      LEFT JOIN 
        attractions a1 ON p.id_attraction = a1.id_attractions
      LEFT JOIN 
        attractions a2 ON p.id_attraction2 = a2.id_attractions
      WHERE 
        bp.id_users = $1;
    `,
      values: [idUser]
    }
    const { rows } = await client.query(query)
    return rows
  } catch (error) {
    console.error('[db] Error al listar pedidos:', error.message)
    throw error
  }
}

export const consults = {
  getUser,
  getUserAll,
  getFilterByRol,
  getFilterByUsername,
  createUserClient,
  createUserOtherType,
  getUserByUsername,
  validateUser,
  validateAccount,
  deleteUser,
  updateUser,
  getHistoryBuy
}
