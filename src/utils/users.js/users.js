export const name = (email) => {
    try {
      // Dividir la dirección de correo electrónico en dos partes usando el símbolo "@"
      const parts = email.split('@')
  
      // Extraer la parte antes del símbolo "@" (el nombre de usuario)
      const username = parts[0]
  
      return username
    } catch (error) {
      // Manejar errores, si es necesario
      console.error('Error al extraer el nombre de usuario:', error)
      return null // O manejar el error de alguna otra manera
    }
  }
  
export const generateRandomUsername = (email) => {
    try {
      // Dividir la dirección de correo electrónico en dos partes usando el símbolo "@"
      const parts = email.split('@')
  
      // Extraer la parte antes del símbolo "@" (el nombre de usuario)
      const username = parts[0]
  
      // Obtener la longitud del nombre de usuario
      const usernameLength = username.length
  
      // Generar una cadena aleatoria de longitud restante
      const randomChars =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      let randomUsername = ''
      for (let i = 0; i < 10 - usernameLength; i++) {
        randomUsername += randomChars.charAt(
          Math.floor(Math.random() * randomChars.length)
        )
      }
  
      // Combinar el nombre de usuario extraído con la cadena aleatoria
      const finalUsername = username + randomUsername
  
      return finalUsername
    } catch (error) {
      // Manejar errores, si es necesario
      console.error('Error al generar el nombre de usuario aleatorio:', error)
      return null // O manejar el error de alguna otra manera
    }
  }