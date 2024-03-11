import axios from 'axios'
import { env } from '../../options/env.js'
import { response } from '../../network/response.js'

const baseURL =
  env.NODE_ENV === 'production' ? env.HOST_PRODUCTION : env.HOST_API
const consumDeberta = async (requestData) => {
  try {
    const responseData = await axios.post(
      `${baseURL}/planni/lenguage/getActivity`,
      requestData
    ) // Utiliza el objeto recibido
    return responseData.data.data.activities.map(
      (activity) => `${activity} ${requestData.cityName}`
    )
  } catch (error) {
    console.error('Error al obtener las actividades:', error)
    throw error
  }
}

export const getTrip = async (req, res) => {
  try {
    const { cityNames, contextUser } = req.body
    console.log(cityNames)

    const requestData = {
      cityName: cityNames,
      context_user: contextUser
    }

    const infoDeberta = await consumDeberta(requestData)
    const stringWords = infoDeberta.join(', ')
    console.log(stringWords)
    const category = ['hotels', 'restaurants', 'attractions']
    const stringCategory = category.join(', ')
    const api = await axios.get(
      'https://api.content.tripadvisor.com/api/v1/location/search',
      {
        params: {
          latLong: '10.4258988,-75.5496305,17',
          searchQuery: stringWords,
          category: stringCategory,
          key: env.KEY_TRIPADVISOR,
          radius: '7.9',
          radiusUnit: 'km',
          language: 'es_CO'
        },
        headers: {
          accept: 'application/json'
        }
      }
    )
    const numberSite = api.data.data.length
    response.success(
      res,
      `TripAdvisor API [ ${stringWords} ] | Number of searched sites: ${numberSite} | Category of searched: ${stringCategory}`,
      api.data,
      200
    )
  } catch (error) {
    console.error('Ha ocurrido un error:', error)
    throw error
  }
}
