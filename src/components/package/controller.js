import { response } from '../../network/response.js'
import { getInfo } from '../../utils/getTripAdvisor/getInfo.js'
import {
  scrapeWebsiteGoogleHotels,
  scrapeWebsiteGetYourGuide
} from '../../utils/webScraping/scraping.js'
import { getDescriptionsAndImages } from '../../utils/getTripAdvisor/getTrip.js'

const scrapeWebsite = async (cityNames, contextUser) => {
  try {
    const getNameOfInfo = await getInfo(cityNames, contextUser)
    const hotels = getNameOfInfo.hotels
    const attractions = getNameOfInfo.attractions
    const restaurantsInfo = getNameOfInfo.restaurants
    /* const hotelePromises = Object.entries(hotels).map(
      ([hotelId, hotelName]) => {
        return scrapeWebsiteGoogleHotels(hotelName).then((result) => {

          return { [hotelId]: result }
        })
      }
    ) */

    const hotelePromises = Object.entries(hotels).map(
      ([hotelId, hotelName]) => {
        return scrapeWebsiteGoogleHotels(hotelName).then(async (result) => {
          try {
            const additionalInfo = await getDescriptionsAndImages(hotelId)
            
            const combinedData = {
              ...result, // Datos del scraping
              description: additionalInfo.description,
              imageUrl: additionalInfo.images
            }

            // Retorna el objeto combinado dentro de un objeto con la clave hotelId
            return { [hotelId]: combinedData }
          } catch (error) {
            console.error('Error fetching additional info:', error)
            // Si hay un error, retorna solo los datos del resultado del scraping
            return { [hotelId]: { ...result } }
          }
        })
      }
    )


    const attractionResults = {}
    for (const [attractionId, atraccionesName] of Object.entries(attractions)) {
      try {
        const result = await scrapeWebsiteGetYourGuide(atraccionesName)
        attractionResults[attractionId] = result
      } catch (error) {
        console.error('Error scraping hotel:', atraccionesName, error)
        attractionResults[attractionId] = { error: 'Failed to scrape data' }
      }
    }
    const hotelsResults = await Promise.all(hotelePromises)
    const data = {
      hotels: hotelsResults,
      attractions: attractionResults,
      restaurants: restaurantsInfo
    }
    return data
  } catch (error) {
    return error
  }
}

export const scrapeWebsiteController = async (req, res) => {
  const { cityNames, contextUser, maxBudget } = req.body
  try {
    const data = await scrapeWebsite(cityNames, contextUser)
    const hotels = data.hotels.map((hotel) => ({
      id: Object.keys(hotel)[0],
      name: Object.values(hotel)[0].title,
      price: Object.values(hotel)[0].price
    }))
    const attractions = Object.values(data.attractions).map((attraction) => ({
      id: attraction.id,
      name: attraction.title,
      price: attraction.price
    }))

    const restaurants = Object.keys(data.restaurants).map((key) => {
      const minPrice = maxBudget * 0.1
      const maxPrice = maxBudget * 0.15
      const randomPrice = Math.random() * (maxPrice - minPrice) + minPrice
      const formattedPrice = Math.round(randomPrice * 100) / 100

      return {
        id: key,
        name: data.restaurants[key],
        price: formattedPrice
      }
    })

    const packages = []
    for (const hotel of hotels) {
      let cheapestPackage = null
      for (let i = 0; i < attractions.length; i++) {
        for (let j = i + 1; j < attractions.length; j++) {
          for (const restaurant of restaurants) {
            const totalPrice =
              hotel.price +
              attractions[i].price +
              attractions[j].price +
              restaurant.price

            if (totalPrice <= maxBudget) {
              const currentPackage = {
                hotel: { id: hotel.id, name: hotel.name, price: hotel.price },
                attractions: [
                  {
                    id: attractions[i].id,
                    name: attractions[i].name,
                    price: attractions[i].price
                  },
                  {
                    id: attractions[j].id,
                    name: attractions[j].name,
                    price: attractions[j].price
                  }
                ],
                restaurant: {
                  id: restaurant.id,
                  name: restaurant.name,
                  price: restaurant.price
                },
                totalCost: totalPrice
              }

              if (
                !cheapestPackage ||
                currentPackage.totalCost < cheapestPackage.totalCost
              ) {
                cheapestPackage = currentPackage
              }
            }
          }
        }
      }
      if (cheapestPackage) {
        packages.push(cheapestPackage)
      }
    }
    response.success(res, 'packages', packages)
  } catch (error) {
    response.error(res, 'Error: ', error)
  }
}

