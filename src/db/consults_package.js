import { db } from './conect.js'

const client = db.client

// Función para verificar si el hotel existe y, si no, crear uno nuevo
const getHotels = async (hotelData) => {
  const { id, name, description, price, imageUrl } = hotelData

  try {
    const query = 'SELECT * FROM hotels WHERE id_hotels = $1'
    const value = [id]
    const { rows } = await client.query(query, value)

    if (rows.length === 0) {
      // El hotel no existe, proceder a crear uno nuevo
      await createHotel(hotelData)
      console.log(`Hotel with id ${id} created.`)
      return hotelData
    } else {
      return rows[0]
    }
  } catch (error) {
    console.error('Error fetching or creating hotel:', error)
    throw error
  }
}

// Función para crear un hotel en la base de datos
const createHotel = async (hotelData) => {
  const { id, name, description, price, imageUrl } = hotelData
  const insertQuery = `
    INSERT INTO hotels (id_hotels, name_hotels, description_hotels, price, imageurl)
    VALUES ($1, $2, $3, $4, $5)
  `
  const values = [id, name, description, price, imageUrl]
  try {
    await client.query(insertQuery, values)
  } catch (error) {
    console.error('Error creating hotel:', error)
    throw error
  }
}

export const packagesConsults = {
  getHotels,
  createHotel
}
