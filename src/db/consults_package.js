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
  const query = `
    SELECT
        p.id_package,
        h.name_hotels,
        h.price AS price_hotels,
        h.description_hotels,
        h.imageurl AS hotels,
        r.name_restaurant,
        r.description_restaurant,
        r.price AS price_restaurant,
        a1.name_attractions AS name_attraction1,
        a1.description_attractions AS description_attraction1,
        a1.price_attraction AS price_attraction1,
        a1.imgsrc_attraction AS img_attraction1,
        a2.name_attractions AS name_attraction2,
        a2.description_attractions AS description_attraction2,
        a2.price_attraction AS price_attraction2,
        a2.imgsrc_attraction AS img_attraction2,
        p.price_package
    FROM
        package p
    LEFT JOIN
        hotels h ON p.id_hotels = h.id_hotels
    LEFT JOIN
        restaurant r ON p.id_restaurant = r.id_restaurant
    LEFT JOIN
        attractions a1 ON p.id_attraction = a1.id_attractions
    LEFT JOIN
        attractions a2 ON p.id_attraction2 = a2.id_attractions
    WHERE
        p.id_package = $1;
  `;
  const values = [idPackage];
  
  try {
    const { rows } = await client.query(query, values);
    if (rows.length === 0) {
      return null;
    } else {
      const packageData = rows[0];
      const response = {
        hotel: {
          id: packageData.id_hotels,
          name: packageData.name_hotels,
          price: packageData.price_hotels,
          description: packageData.description_hotels,
          imageUrl: packageData.hotels
        },
        restaurant: {
          id: packageData.id_restaurant,
          name: packageData.name_restaurant,
          price: packageData.price_restaurant
        },
        attractions: [
          {
            id: packageData.id_attraction1,
            name: packageData.name_attraction1,
            price: packageData.price_attraction1,
            imgSrc: packageData.img_attraction1
          },
          {
            id: packageData.id_attraction2,
            name: packageData.name_attraction2,
            price: packageData.price_attraction2,
            imgSrc: packageData.img_attraction2
          }
        ],
        totalCost: packageData.price_package
      };
  
      return response;
    }
  } catch (error) {
    console.error('Error fetching package:', error);
    throw error;
  }
};


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
