import puppeteer from 'puppeteer'
import { response } from '../../network/response.js'
import { getTrip, getTripUrl } from '../../utils/getTripAdvisor/getTrip.js'

export const scrapeWebsite = async (req, res) => {
  const { cityNames, contextUser } = req.body
  try {
    const infoTrip = await getTrip(cityNames, contextUser)

    // Obtener los primeros cuatro elementos de cada categoría
    const hotels = infoTrip.hotels.data.slice(0, 4)
    const restaurants = infoTrip.restaurants.data.slice(0, 4)

    // Filtrar atracciones por nombre que contenga "tour"
    const attractionsWithTour = infoTrip.attractions.data.filter((attraction) =>
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
      const remainingAttractions = infoTrip.attractions.data
        .filter((attraction) => !attraction.name.toLowerCase().includes('tour'))
        .slice(0, remainingAttractionsCount)
      attractions = attractions.concat(remainingAttractions)
    }

    // Obtener las URLs de hoteles, atracciones y restaurantes de forma concurrente
    const [hotelUrls, attractionUrls, restaurantUrls] = await Promise.all([
      Promise.all(hotels.map((hotel) => getTripUrl(hotel.location_id))),
      Promise.all(
        attractions.map((attraction) => getTripUrl(attraction.location_id))
      ),
      Promise.all(
        restaurants.map((restaurant) => getTripUrl(restaurant.location_id))
      )
    ])

    // Almacenar las URLs en un diccionario por categoría
    const urlsByCategory = {
      hotels: Object.fromEntries(
        hotels.map((hotel, index) => [hotel.location_id, hotelUrls[index]])
      ),
      attractions: Object.fromEntries(
        attractions.map((attraction, index) => [
          attraction.location_id,
          attractionUrls[index]
        ])
      ),
      restaurants: Object.fromEntries(
        restaurants.map((restaurant, index) => [
          restaurant.location_id,
          restaurantUrls[index]
        ])
      )
    }

    console.log(urlsByCategory)
  } catch (error) {
    console.error('Ha ocurrido un error:', error)
    response.error('Ha ocurrido un error', error, 500)
  }
}
