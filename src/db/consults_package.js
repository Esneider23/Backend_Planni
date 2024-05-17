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
    const { id } = idAttraction
    const query = 'SELECT * FROM attractions WHERE id_attractions = $1'
    const value = [id]
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

const createAtraction = async (attractionInfo) => {
  const { id, name, description, price, imageUrl } = attractionInfo
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

const getRestaurant = async (idRestaurant) => {
  const { id } = idRestaurant
  const query = 'SELECT * FROM restaurant WHERE id_restaurant = $1'
  const value = [id]
  try {
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

const createRestaurant = async (restaurantInfo) => {
  const { id, name, description, price } = restaurantInfo
  console.log(restaurantInfo)
  const insertQuery = `
      INSERT INTO restaurant (id_restaurant, name_restaurant, description_restaurant, price)
      VALUES ($1, $2, $3, $4)
    `
  const values = [id, name, description, price]
  try {
    await client.query(insertQuery, values)
  } catch (error) {
    console.error('Error creating restaurant:', error)
    throw error
  }
}

const getPackages = async (idPackage) => {
  const { id } = idPackage
  const query = 'SELECT * FROM package WHERE id_package = $1'
  const value = [id]
  try {
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

const createPackage = async (packageInfo) => {
  const {hotelId, idAttraction, idAttraction2 , restaurantId, pricePackage } =
    packageInfo
  const insertQuery = `
    INSERT INTO package (id_hotels, id_attraction, id_attraction2, id_restaurant, price_package)
    VALUES ($1, $2, $3, $4, $5)
  `
  const values = [hotelId, idAttraction, idAttraction2, restaurantId, pricePackage]
  try {
    await client.query(insertQuery, values)
  } catch (error) {
    console.error('Error creating package:', error)
    throw error
  }
}

export const packagesConsults = {
  getHotels,
  createHotel,
  getAtraction,
  createAtraction,
  getRestaurant,
  createRestaurant,
  getPackages,
  createPackage
}
