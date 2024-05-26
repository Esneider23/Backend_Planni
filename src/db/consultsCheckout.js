import { db } from './conect.js'
const client = db.client


const checkout = async ( idPackage, idUser ) =>  {
    try {
        const query = "INSERT INTO buy_package ( id_package, id_users ) VALUES ($1, $2)"
        const values = [idPackage, idUser]
        const { rows } = await client.query(query, values)
        console.log('[db] pago finalizado', rows[0])
        return rows[0]
    } catch (error) {
        console.error('[db] Error al finizar el pago:', error.message)
      throw error
    }
}

export const consults = { checkout }