import { getTrip } from './getTrip.js'

export const getInfo = async (cityNames, contextUser) => {
  try {
    const infoTrip = await getTrip(cityNames, contextUser)

    // Obtener los primeros cuatro elementos de cada categoría
    const hotels = infoTrip.hotels.slice(0, 4)
    const restaurants = infoTrip.restaurants.slice(0, 4)

    // Filtrar atracciones por nombre que contenga "tour"

    const attractionsWithTour = infoTrip.attractions.filter((attraction) =>
      attraction.name.toLowerCase().includes('tour')
    )

    // Tomar las primeras 4 atracciones con "tour"
    let attractions = attractionsWithTour.slice(
      0,
      Math.min(4, attractionsWithTour.length)
    )

    // Si hay menos de 4 atracciones con "tour", completar con atracciones normales
    const remainingAttractionsCount = 4 - attractions.length
    if (remainingAttractionsCount > 0) {
      const remainingAttractions = infoTrip.attractions
        .filter((attraction) => !attraction.name.toLowerCase().includes('tour'))
        .slice(0, remainingAttractionsCount)
      attractions = attractions.concat(remainingAttractions)
    }

    // Obtener los nombres de hoteles, atracciones y restaurantes de forma concurrente
    const [hotelName, attractionName, restaurantName] = await Promise.all([
      Promise.all(hotels.map((hotel) => hotel.name)),
      Promise.all(attractions.map((attraction) => attraction.name)),
      Promise.all(restaurants.map((restaurant) => restaurant.name))
    ])

    // Almacenar los Nombres en un diccionario por categoría
    const getName = {
      hotels: Object.fromEntries(
        hotels.map((hotel, index) => [hotel.location_id, hotelName[index]])
      ),
      attractions: Object.fromEntries(
        attractions.map((attraction, index) => [
          attraction.location_id,
          attractionName[index]
        ])
      ),
      restaurants: Object.fromEntries(
        restaurants.map((restaurant, index) => [
          restaurant.location_id,
          restaurantName[index]
        ])
      )
    }
    return getName
  } catch (error) {
    console.error(error)
  }
}
