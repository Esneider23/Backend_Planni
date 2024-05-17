import { response } from '../../network/response.js'
import { getInfo } from '../../utils/getTripAdvisor/getInfo.js'
import {
  scrapeWebsiteGoogleHotels,
  scrapeWebsiteGetYourGuide
} from '../../utils/webScraping/scraping.js'
import { getDescriptionsAndImages } from '../../utils/getTripAdvisor/getTrip.js'
import { packagesConsults } from '../../db/consults_package.js'

const scrapeWebsite = async (cityNames, contextUser, maxBudget) => {
  const getNameOfInfo = await getInfo(cityNames, contextUser)
  const hotels = getNameOfInfo.hotels
  const attractions = getNameOfInfo.attractions
  const restaurantsInfo = getNameOfInfo.restaurants

  const hotelsResults = await Promise.all(
    Object.entries(hotels).map(async ([hotelId, hotelName]) => {
      try {
        let hotelInfo = await packagesConsults.getHotels({ id: hotelId })

        if (!hotelInfo) {
          const scrapeResult = await scrapeWebsiteGoogleHotels(hotelName)
          const additionalInfo = await getDescriptionsAndImages(hotelId)
          hotelInfo = {
            id: hotelId,
            name: hotelName,
            description: additionalInfo.description,
            price: scrapeResult.price,
            imageUrl: additionalInfo.images
          }

          await packagesConsults.createHotel(hotelInfo)
        }
        return hotelInfo
      } catch (error) {
        console.error('Error processing hotel:', hotelName, error)
        return { id: hotelId, error: 'Failed to retrieve or save hotel data' }
      }
    })
  )

  const attractionResults = await Promise.all(
    Object.entries(attractions).map(async ([attractionId, attractionName]) => {
      try {
        let attractionInfo = await packagesConsults.getAtraction({
          id: attractionId
        })

        if (!attractionInfo) {
          const result = await scrapeWebsiteGetYourGuide(attractionName)
          attractionInfo = {
            id: attractionId,
            name: result.title,
            description: result.description,
            price: result.price,
            imageUrl: result.src
          }

          await packagesConsults.createAtraction(attractionInfo)
        }
        return attractionInfo
      } catch (error) {
        console.error('Error scraping attraction:', attractionName, error)
        return { id: attractionId, error: 'Failed to scrape data' }
      }
    })
  )
  const restaurantsData = await Promise.all(
    Object.keys(restaurantsInfo).map(async (key) => {
      const minPrice = maxBudget * 0.1
      const maxPrice = maxBudget * 0.15
      const randomPrice = Math.random() * (maxPrice - minPrice) + minPrice
      const formattedPrice = Math.round(randomPrice * 100) / 100
      try {
        let restaurantInfo = await packagesConsults.getRestaurant({ id: key })
        if (!restaurantInfo) {
          restaurantInfo = {
            id: key,
            name: restaurantsInfo[key],
            description: 'Restaurant description',
            price: formattedPrice
          }
          await packagesConsults.createRestaurant(restaurantInfo)
        }
        return restaurantInfo
      } catch (error) {
        console.error('Error processing restaurant:', error)
        return { id: key, error: 'Failed to retrieve or save restaurant data' }
      }
    })
  )
  return {
    hotels: hotelsResults,
    attractions: attractionResults,
    restaurants: restaurantsData
  }
}

export const scrapeWebsiteController = async (req, res) => {
  const { cityNames, contextUser, maxBudget } = req.body

  try {
    const data = await scrapeWebsite(cityNames, contextUser, maxBudget)
    const hotels = data.hotels.filter((hotel) => !hotel.error)
    const attractions = data.attractions.filter(
      (attraction) => !attraction.error
    )
    const restaurants = data.restaurants.filter(
      (restaurant) => !restaurant.error
    )

    const packages = []

    for (const hotel of hotels) {
      const hotelPackages = []

      for (let i = 0; i < attractions.length; i++) {
        for (let j = i + 1; j < attractions.length; j++) {
          for (const restaurant of restaurants) {
            const hotelPrice = parseFloat(hotel.price)
            const attraction1Price = parseFloat(attractions[i].price_attraction)
            const attraction2Price = parseFloat(attractions[j].price_attraction)
            const restaurantPrice = parseFloat(restaurant.price)

            if (
              isNaN(hotelPrice) ||
              isNaN(attraction1Price) ||
              isNaN(attraction2Price) ||
              isNaN(restaurantPrice)
            ) {
              console.log('Precio inválido detectado, omitiendo paquete:')
              continue
            }

            const totalPrice =
              hotelPrice + attraction1Price + attraction2Price + restaurantPrice
            if (totalPrice <= maxBudget) {
              hotelPackages.push({
                hotel: {
                  id: hotel.id_hotels,
                  name: hotel.name_hotels,
                  price: hotelPrice,
                  description: hotel.description_hotels,
                  imageUrl: hotel.imageurl
                },
                attractions: [
                  {
                    id: attractions[i].id_attractions,
                    name: attractions[i].name_attractions,
                    price: attraction1Price,
                    imgSrc: attractions[i].imgsrc_attraction
                  },
                  {
                    id: attractions[j].id_attractions,
                    name: attractions[j].name_attractions,
                    price: attraction2Price,
                    imgSrc: attractions[j].imgsrc_attraction
                  }
                ],
                restaurant: {
                  id: restaurant.id_restaurant,
                  name: restaurant.name_restaurant,
                  price: restaurantPrice
                },
                totalCost: totalPrice
              })
            }
          }
        }
      }

      // Encontrar el paquete más económico para este hotel
      const cheapestPackage = hotelPackages.sort(
        (a, b) => a.totalCost - b.totalCost
      )[0]
      if (cheapestPackage) {
        packages.push(cheapestPackage)
        // Crear y guardar el paquete en la base de datos
        await packagesConsults.createPackage({
          hotelId: cheapestPackage.hotel.id,
          idAttraction: cheapestPackage.attractions[0].id,
          idAttraction2: cheapestPackage.attractions[1].id,
          restaurantId: cheapestPackage.restaurant.id,
          pricePackage: cheapestPackage.totalCost
        })
      }
    }

    response.success(res, 'packages', packages)
  } catch (error) {
    response.error(res, 'Error: ', error)
  }
}

