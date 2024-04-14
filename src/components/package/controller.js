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
    const hotelPromises = Object.entries(hotels).map(([hotelId, hotelName]) => {
      return scrapeWebsiteGoogleHotels(hotelName).then((result) => {
        return { [hotelId]: result }
      })
    })
    const attractionPromises = Object.entries(attractions).map(([attractionId, attractionName]) => {
      return scrapeWebsiteGetYourGuide(attractionName).then((result) => {
        return { [attractionId]: result }
      })
    })
    const hotelsResults = await Promise.all(hotelPromises)
    const attractionsResults = await Promise.all(attractionPromises)
    console.log(hotelsResults)
    console.log(attractionsResults)

  } catch (error) {
    response.error(res, error)
  }
}
