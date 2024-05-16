import { response } from '../../network/response.js'
import { getInfo } from '../../utils/getTripAdvisor/getInfo.js'
import {
  scrapeWebsiteGoogleHotels,
  scrapeWebsiteGetYourGuide
} from '../../utils/webScraping/scraping.js'
import { getDescriptionsAndImages } from '../../utils/getTripAdvisor/getTrip.js'
import { packagesConsults } from '../../db/consults_package.js'

const scrapeWebsite = async (cityNames, contextUser) => {
  const getNameOfInfo = await getInfo(cityNames, contextUser)
  const hotels = getNameOfInfo.hotels
  const attractions = getNameOfInfo.attractions
  const restaurantsInfo = getNameOfInfo.restaurants
  const hotelsResults = []

  for (const [hotelId, hotelName] of Object.entries(hotels)) {
    try {
      // Verificar si el hotel ya está en la base de datos
      let hotelInfo = await packagesConsults.getHotels({ id: hotelId })

      if (!hotelInfo) {
        // Si no está en la base de datos, realizar el scraping
        const scrapeResult = await scrapeWebsiteGoogleHotels(hotelName)
        const additionalInfo = await getDescriptionsAndImages(hotelId)
        hotelInfo = {
          id: hotelId,
          name: hotelName,
          description: additionalInfo.description,
          price: scrapeResult.price,
          imageUrl: additionalInfo.images
        }

        // Guardar el hotel en la base de datos
        await packagesConsults.createHotel(hotelInfo)
      }
      hotelsResults.push({ [hotelId]: hotelInfo })
    } catch (error) {
      console.error('Error processing hotel:', hotelName, error)
      hotelsResults.push({
        [hotelId]: { error: 'Failed to retrieve or save hotel data' }
      })
    }
  }
  const attractionResults = {}
  for (const [attractionId, attractionName] of Object.entries(attractions)) {
    try {
      let attractionInfoDb = await packagesConsults.getAtraction(attractionId)
      if (!attractionInfoDb) {
        const result = await scrapeWebsiteGetYourGuide(attractionName)
        const attractionInfo = {
          id: attractionId,
          name: result.title,
          description: result.description,
          price: result.price,
          imageUrl: result.imgSrc
        }
        // await packagesConsults.createAtraction(attractionInfo)
        attractionResults[attractionId] = attractionInfo
      } else {
        attractionResults[attractionId] = attractionInfoDb
      }
    } catch (error) {
      console.error('Error scraping attraction:', attractionName, error)
      attractionResults[attractionId] = {
        error: 'Failed to scrape data',
        id: attractionId
      }
    }
  }


  const data = {
    hotels: hotelsResults,
    attractions: attractionResults,
    restaurants: restaurantsInfo
  }
  return data
}

export const scrapeWebsiteController = async (req, res) => {
  const { cityNames, contextUser, maxBudget } = req.body
  try {
    const data = await scrapeWebsite(cityNames, contextUser)
    const hotels = data.hotels.map((hotel) => ({
      id: Object.keys(hotel)[0],
      name: Object.values(hotel)[0].name_hotels,
      description: Object.values(hotel)[0].description_hotels,
      price: Object.values(hotel)[0].price,
      imageUrl: Object.values(hotel)[0].imageUrl
    }))

    const attractions = Object.values(data.attractions).map((attraction) => ({
      id: attraction.id,
      name: attraction.name_attractions,
      description: attraction.description_attractions,
      price: attraction.price_attraction,
      imgSrc: attraction.imgSrc_attraction
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
                hotel: {
                  id: hotel.id,
                  name: hotel.name,
                  price: hotel.price,
                  description: hotel.description,
                  imageUrl: hotel.imageUrl
                },
                attractions: [
                  {
                    id: attractions[i].id,
                    name: attractions[i].name,
                    price: attractions[i].price,
                    imgSrc: attractions[i].imgSrc
                  },
                  {
                    id: attractions[j].id,
                    name: attractions[j].name,
                    price: attractions[j].price,
                    imgSrc: attractions[j].imgSrc
                  }
                ],
                restaurant: {
                  id: restaurant.id,
                  name: restaurant.name,
                  price: restaurant.price
                },
                totalCost: totalPrice
              }

              packages.push(currentPackage)
            }
          }
        }
      }
    }

    // Ordenar los paquetes por costo total ascendente y tomar los tres mejores
    const bestPackages = packages
      .sort((a, b) => a.totalCost - b.totalCost)
      .slice(0, 3)

    response.success(res, 'packages', bestPackages)
  } catch (error) {
    response.error(res, 'Error: ', error)
  }
}
