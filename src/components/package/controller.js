import { response } from '../../network/response.js'
import {getInfo } from '../../utils/getTripAdvisor/getInfo.js'
import { scrapeWebsiteGoogleHotels, scrapeWebsiteGetYourGuide } from '../../utils/webScraping/scraping.js'

export const scrapeWebsite = async (req, res) => {
  try {
    const { cityNames, contextUser } = req.body
    const getNameOfInfo = await getInfo(cityNames, contextUser)
    const hotels = getNameOfInfo.hotels
    const attractions = getNameOfInfo.attractions
    const restaurantsInfo = getNameOfInfo.restaurants

    // Ejecutar solicitudes de scraping de hoteles en paralelo
    const hotelPromises = Object.entries(hotels).map(
      async ([locationId, hotelName]) => {
        const hotel = await scrapeWebsiteGoogleHotels(hotelName)
        return { locationId, hotel }
      }
    )

    // Ejecutar solicitudes de scraping de atracciones en paralelo
    const attractionsPromises = Object.entries(attractions).map(
      async ([locationId, attractionName]) => {
        const attraction = await scrapeWebsiteGetYourGuide(attractionName)
        return { locationId, attraction }
      }
    )

    // Esperar a que todas las solicitudes de scraping de hoteles y atracciones se completen
    const [hotelPrices, attractionPrices] = await Promise.all([
      Promise.all(hotelPromises),
      Promise.all(attractionsPromises)
    ])
    console.log(hotelPrices)
    response.success(res, 'Data successfully scraped', "word")
  } catch (error) {
    response.error(res, error)
  }
}
