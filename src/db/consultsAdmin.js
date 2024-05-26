import { db } from './conect.js'
const client = db.client

const getAllusers = async () => {
  try {
    const query =
      'SELECT id_users, username, name_user, lastname_user, id_country, email, phone, address, id_rol FROM users'
    const { rows } = await client.query(query)
    console.log('[db] listado de usuarios', rows[0])
    return rows[0]
  } catch (error) {
    console.error('[db] Error al listar usuarios:', error.message)
    throw error
  }
}

const createPackage = async (
  idPackage,
  idHotels,
  idRestaurant,
  idAttraction,
  idAttraction2,
  pricePackage
) => {
  try {
    const query = `
        INSERT INTO public."package" (
          id_package, 
          id_hotels, 
          id_restaurant, 
          id_attraction, 
          id_attraction2, 
          price_package, 
          trial456
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      `

    const values = [
      idPackage,
      idHotels,
      idRestaurant,
      idAttraction,
      idAttraction2,
      pricePackage
    ]

    const { rows } = await client.query(query, values)
    console.log('[db] se ingreso correctamente', rows[0])
    return rows[0]
  } catch (error) {
    console.error('Error executing query:', error)
    throw error;
  }
}

const deletePackage = async (id) => {
  try {
    const query = `
        DELETE FROM package
        WHERE id_package = $1
        `
    const { rows } = await client.query(query);
    console.log('[db] se elimino el paquete', rows[0])
    return rows[0]
  } catch (error) {
    console.error('[db] Error al eliminar el usuario:', error.message)
    throw error
  }
}

export const consults = { getAllusers, createPackage, deletePackage }
