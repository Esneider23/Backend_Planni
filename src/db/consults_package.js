import { db } from './conect.js'

const client = db.client

const getHotels = async (hotelData) => {
  const { id } = hotelData

  try {
    const query = 'SELECT * FROM hotels WHERE id_hotels = $1'
    const value = [id]
    const { rows } = await client.query(query, value)

    if (rows.length === 0) {
      return null // Hotel no existe en la base de datos
    } else {
      return rows[0] // Hotel encontrado en la base de datos
    }
  } catch (error) {
    console.error('Error fetching hotel:', error)
    throw error
  }
}

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

const getAtraction = async (idAttraction) => {
  try {
    const query = 'SELECT * FROM attractions WHERE id_attractions = $1'
    const value = [idAttraction]
    const { rows } = await client.query(query, value)
    if (rows.length === 0) {
      return null
    } else {
      return rows[0]
    }
  } catch (error) {
    console.error('Error fetching hotel:', error)
    throw error
  }
}

const createAtraction = async (attractionData) => {
  const { id, name, description, price, imageUrl } = attractionData
  const insertQuery = `
    INSERT INTO attractions (id_attractions, name_attractions, description_attractions, price_attraction, imgsrc_attraction)
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
  createHotel,
  getAtraction,
  createAtraction
}
