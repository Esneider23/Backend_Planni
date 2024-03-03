import { db } from './conect.js'
const client = db.client

const getUser = async (email) => {
  try {
    const query = 'SELECT * FROM users WHERE email = $1'
    const values = [email]
    const { rows } = await client.query(query, values)
    console.log('[db] Consulted user', rows[0])
    return rows
  } catch (error) {
    // Manejar el error
    console.error('[db] Error al consultar usuario:', error.message)
    throw error // Lanzar el error nuevamente para que se maneje en el código que llama a esta función
  }
}

const name = (email) => {
  try {
    // Dividir la dirección de correo electrónico en dos partes usando el símbolo "@"
    const parts = email.split('@');
    
    // Extraer la parte antes del símbolo "@" (el nombre de usuario)
    const username = parts[0];
    
    return username;
  } catch (error) {
    // Manejar errores, si es necesario
    console.error('Error al extraer el nombre de usuario:', error);
    return null; // O manejar el error de alguna otra manera
  }
};

const generateRandomUsername = (email) => {
  try {
    // Dividir la dirección de correo electrónico en dos partes usando el símbolo "@"
    const parts = email.split('@');
    
    // Extraer la parte antes del símbolo "@" (el nombre de usuario)
    const username = parts[0];
    
    // Obtener la longitud del nombre de usuario
    const usernameLength = username.length;
    
    // Generar una cadena aleatoria de longitud restante
    const randomChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomUsername = '';
    for (let i = 0; i < 10 - usernameLength; i++) {
      randomUsername += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    
    // Combinar el nombre de usuario extraído con la cadena aleatoria
    const finalUsername = username + randomUsername;
    
    return finalUsername;
  } catch (error) {
    // Manejar errores, si es necesario
    console.error('Error al generar el nombre de usuario aleatorio:', error);
    return null; // O manejar el error de alguna otra manera
  }
};


const createUserClient = async (email, password, country) => {
  try {
    const name_user = await name(email);
    const username = await generateRandomUsername(email);
    const query = 'INSERT INTO users (username, name_user, id_country, email, password, id_rol) VALUES ($1, $2, $3, $4, $5, $6)'
    const values = [username, name_user, country, email, password, '3']
    const { rowCount } = await client.query(query, values)
    console.log('[db] Created user', rowCount)
    return rowCount
  } catch (error) {
    // Manejar el error
    console.error('[db] Error al crear usuario:', error.message)
    throw error // Lanzar el error nuevamente para que se maneje en el código que llama a esta función
  }
}

export const consults = {
  getUser,
  createUserClient,
}
