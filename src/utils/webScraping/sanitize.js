export const sanitize = (info) => {
  const sanitizedTitle = info.title.trim()
  let sanitizedPrice = info.price

  // Verificar si el precio es un número y convertirlo a cadena si es necesario
  if (typeof info.price === 'number') {
    sanitizedPrice = info.price.toString()
  }

  // Eliminar el prefijo "COP" y cualquier carácter no numérico, excepto dígitos.
  sanitizedPrice = sanitizedPrice.replace(/$|\D/g, '').trim()

  // Convertir la cadena resultante en un número.
  const numericPrice = parseInt(sanitizedPrice, 10)

  // Devolver el objeto hotel con el título saneado y el precio como número.
  return {
    title: sanitizedTitle,
    price: numericPrice // Ahora price es un número
  }
}