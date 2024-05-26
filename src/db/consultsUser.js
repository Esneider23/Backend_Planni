import { db } from './conect.js'
const client = db.client

// Obtener usuario por ID
const getConfigUser = async (id) => {
    try {
      const query = 'SELECT * FROM users WHERE id_users = $1'
      const values = [id]
      const { rows } = await client.query(query, values)
      console.log('[db] Consulted user by ID', rows[0])
      return rows[0]
    } catch (error) {
      console.error('[db] Error al consultar usuario por ID:', error.message)
      throw error
    }
  }
  
  // Actualizar información del usuario
  const updateUser = async (id, userData) => {
    const { username, name_user, lastname_user, id_country, email, password, phone, address, id_rol } = userData
    try {
      const query = `
        UPDATE users
        SET username = $1, name_user = $2, lastname_user = $3, id_country = $4, email = $5, password = $6, phone = $7, address = $8, id_rol = $9
        WHERE id_users = $10
        RETURNING *`
      const values = [username, name_user, lastname_user, id_country, email, password, phone, address, id_rol, id]
      const { rows } = await client.query(query, values)
      console.log('[db] Updated user', rows[0])
      return rows[0]
    } catch (error) {
      console.error('[db] Error al actualizar usuario:', error.message)
      throw error
    }
  }
  
  
  
  const favoriteUser = async (idUser, idPackage) => {
    try {
      const query = 'INSERT INTO favorites (id_user, id_package) VALUES ($1, $2)'
      const values = [idUser, idPackage]
      const {rows} = await client.query(query, values)
      console.log('[db] save favorite package', rows[0])
      return rows[0]
    } catch (error) {
      console.error('[db] Error al guardar favorito:', error.message)
      throw error
    }
  }
  
  // Eliminar usuario
  const deleteUser = async (id) => {
    try {
      const query = 'DELETE FROM users WHERE id_users = $1 RETURNING *'
      const values = [id]
      const { rows } = await client.query(query, values)
      console.log('[db] Deleted user', rows[0])
      return rows[0]
    } catch (error) {
      console.error('[db] Error al eliminar usuario:', error.message)
      throw error
    }
  }

  const getAllCheckOut = async (idUser) => {
    try {
      const query = `
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
      `;
      const values = [idUser];
      const { rows } = await client.query(query, values);
      console.log('[db] listado de pedidos', rows);
      return rows;
    } catch (error) {
      console.error('[db] Error al listar pedidos:', error.message);
      throw error;
    }
  };
  
  

export const consults = {
    getConfigUser, 
    updateUser, 
    deleteUser,
    favoriteUser,
    getAllCheckOut
}