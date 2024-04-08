export const sanitize = (hotelInfo) => {
  const sanitizedTitle = hotelInfo.title.trim()
  let sanitizedPrice = hotelInfo.price

  // Verificar si el precio es un número y convertirlo a cadena si es necesario
  if (typeof hotelInfo.price === 'number') {
    sanitizedPrice = hotelInfo.price.toString()
  }

  // Eliminar el prefijo "COP" y cualquier carácter no numérico, excepto dígitos.
  sanitizedPrice = sanitizedPrice.replace(/COP|\D/g, '').trim()

  // Convertir la cadena resultante en un número.
  const numericPrice = parseInt(sanitizedPrice, 10)

  // Devolver el objeto hotel con el título saneado y el precio como número.
  return {
    title: sanitizedTitle,
    price: numericPrice // Ahora price es un número
  }
}
