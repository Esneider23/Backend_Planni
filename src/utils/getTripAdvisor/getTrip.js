import axios from 'axios'
import { env } from '../../options/env.js'
import { getActivity } from '../deberta/consumDeberta.js'

export const getTrip = async (cityNames, contextUser) => {
  try {
    const infoDeberta = await getActivity(cityNames, contextUser)
    const stringWords = infoDeberta.join(', ')

    const category = ['hotels', 'restaurants', 'attractions']

    const results = {} // Objeto para almacenar los resultados por categoría

    // Realizar una consulta a la API de TripAdvisor para cada categoría
    for (const cat of category) {
      const api = await axios.get(
        'https://api.content.tripadvisor.com/api/v1/location/search',
        {
          params: {
            latLong: '10.4258988,-75.5496305,17',
            searchQuery: stringWords,
            category: cat,
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

      // Almacena los resultados en el objeto por categoría
      results[cat] = api.data
    }

    // Devolver los resultados después de que todas las categorías hayan sido procesadas
    return results
  } catch (error) {
    console.error('Ha ocurrido un error:', error)
    throw error
  }
}

export const getTripUrl = async (locationId) => {
  try {
    const api = await axios.get(
      `https://api.content.tripadvisor.com/api/v1/location/${locationId}/details`,
      {
        params: {
          key: env.KEY_TRIPADVISOR,
          language: 'es_CO'
        },
        headers: {
          accept: 'application/json'
        }
      }
    )
    return api.data.web_url
  } catch (error) {
    console.error('Ha ocurrido un error:', error)
    throw error
  }
}