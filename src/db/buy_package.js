import { db } from './conect.js'

const client = db.client

const buysPackage = async (data) => {
    const now = new Date();
    try {
        const query = {
            text: 'INSERT INTO buy_package (id_users, id_package, date_buy) VALUES ($1, $2, $3) RETURNING id_buy_package',
            values: [data.id_users, data.id_package, now]
        }
        const { rows } = await client.query(query);
        const buyIdPackage = rows[0].id_buy_package;
        const infoPackage = await consultsInfoPackage(buyIdPackage);
        return infoPackage;
    } catch (error) {
        console.error('[db] Error al comprar paquete:', error.message);
        throw error;
    }
};

const consultsInfoPackage = async (id) => {
    try {
        const query = {
            text: 
            `SELECT
            buy_package.id_buy_package,
            users.name_user,
            users.lastname_user,
            users.email,
            users.phone,
            users.address,
            country.name_country,
            hotels.name_hotels,
            restaurant.name_restaurant,
            attractions1.name_attractions AS attraction1,
            attractions2.name_attractions AS attraction2,
            package.price_package
            FROM users
            JOIN country ON users.id_country = country.id_country
            JOIN buy_package ON users.id_users = buy_package.id_users
            JOIN package ON buy_package.id_package = package.id_package
            JOIN hotels ON package.id_hotels = hotels.id_hotels
            JOIN restaurant ON package.id_restaurant = restaurant.id_restaurant
            JOIN attractions AS attractions1 ON package.id_attraction = attractions1.id_attractions
            JOIN attractions AS attractions2 ON package.id_attraction2 = attractions2.id_attractions
            WHERE buy_package.id_buy_package = $1`,
            values: [id]
        }
        const { rows } = await client.query(query);
        return rows;
    } catch (error) {
        console.error('[db] Error al consultar la informacion del paquete:', error.message);
        throw error;
    }
};



export const consultsBuys = {
    buysPackage
}