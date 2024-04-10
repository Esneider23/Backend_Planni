import { response } from '../../network/response.js'
import { getTrip } from '../../utils/getTripAdvisor/getTrip.js'
import { scrapeWebsiteGoogleHotels, scrapeWebsiteViator } from '../../utils/webScraping/scraping.js'

const getUrls = async (cityNames, contextUser) => {
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
    const [hotelName, attractionName, restaurantName] = await Promise.all([
      Promise.all(hotels.map((hotel) => hotel.name)),
      Promise.all(
        attractions.map((attraction) => attraction.name)
      ),
      Promise.all(
        restaurants.map((restaurant) => restaurant.name)
      )
    ])

    // Almacenar las URLs en un diccionario por categoría
    const urlsByCategory = {
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
    return urlsByCategory
  } catch (error) {
    console.error(error)
  }
}

export const scrapeWebsite = async (req, res) => {
  try {
    const { cityNames, contextUser } = req.body
    const urlsByCategory = await getUrls(cityNames, contextUser)
    const hotels = urlsByCategory.hotels
    const attractions = urlsByCategory.attractions
    /* const hotelPromises = Object.keys(hotels).map(async (locationId) => {
      const hotelName = hotels[locationId]
      const hotel = await scrapeWebsiteGoogleHotels(hotelName)
      return { locationId, hotel }
    })
    const hotelPrices = await Promise.all(hotelPromises) */
    const attractionsPromises = Object.keys(attractions).map(async (locationId) => {
      const attractionName = attractions[locationId]
      console.log(attractionName)
      const attraction = await scrapeWebsiteViator(attractionName)
      console.log(locationId, attraction)
      return { locationId, attraction }
    })
    response.success(res, 'price of hotels', attractionsPromises)
  } catch (error) {
    response.error(res, error)
  }
}