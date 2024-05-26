import { db } from './conect.js'
const client = db.client

const getAllusers = async () => {
    try {
        const query = "SELECT id_users, username, name_user, lastname_user, id_country, email, phone, address, id_rol FROM users"
        const {rows} = await client.query(query)
        console.log('[db] listado de usuarios', rows[0])
        return rows[0];
    } catch (error) {
        console.error('[db] Error al listar usuarios:', error.message)
        throw error
    }
}



export const consults = { getAllusers }