import puppeteer from 'puppeteer'
import { response } from '../../network/response.js'
import { getTrip } from '../../utils/getTripAdvisor/getTrip.js'

export const scrapeWebsite = async (req, res) => {
  const { cityNames, contextUser } = req.body
  try {
    const infoTrip = await getTrip(cityNames, contextUser)
    response.success(res, infoTrip, 200)
  } catch (error) {
    console.error('Ha ocurrido un error:', error)
    response.error('Ha ocurrido un error', error, 500)
  }
}
