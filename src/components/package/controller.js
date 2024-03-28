import puppeteer from 'puppeteer'
import axios from 'axios'
import { env } from '../../options/env.js'
import { response } from '../../network/response.js'

const baseURL =
  env.NODE_ENV === 'production' ? env.HOST_PRODUCTION : env.HOST_API

const id = async (infoBody) => {
  try {
    const responseData = await axios.get(`${baseURL}/planni/trip/`, infoBody)
    return responseData.data.data.activities.map(
      (activity) => `${activity} ${infoBody.cityName}`
    )
  } catch (error) {
    console.error('Error al obtener los id:', error)
    throw error
  }
}

export const scrapeWebsite = async (req, res) => {
  const { cityNames, contextUser } = req.body
  const infoBody = {
    cityName: cityNames,
    context_user: contextUser
  }
  console.log(infoBody)
  const activities = await id(infoBody)
  console.log(activities)
}
