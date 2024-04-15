import axios from 'axios'
import { env } from '../../options/env.js'
import { getActivity } from '../deberta/consumDeberta.js'

const tripAsync = async (infoDeberta, stringWords, category, results) => {
  const api = await axios.get(
    'https://api.content.tripadvisor.com/api/v1/location/search',
    {
      params: {
        latLong: env.LATLONG,
        searchQuery: stringWords,
        category,
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

  // Si no hay resultados para la búsqueda conjunta, realizar búsquedas individuales
  if (api.data.data.length === 0) {
    const individualResults = await Promise.all(
      infoDeberta.map(async (word) => {
        const individualApi = await axios.get(
          'https://api.content.tripadvisor.com/api/v1/location/search',
          {
            params: {
              latLong: env.LATLONG,
              searchQuery: word,
              category,
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
        return individualApi.data.data
      })
    )

    individualResults.flat()
    results[category] = individualResults
  } else {
    // Almacena los resultados en el objeto por categoría
    results[category] = api.data.data
  }
}

export const getTrip = async (cityNames, contextUser) => {
  try {
    const infoDeberta = await getActivity(cityNames, contextUser)
    const stringWords = infoDeberta.join(', ')
    const category = ['hotels', 'restaurants', 'attractions']

    const results = {} // Objeto para almacenar los resultados por categoría

    // Realizar una consulta a la API de TripAdvisor para cada categoría

    await Promise.all(
      category.map((cat) => tripAsync(infoDeberta, stringWords, cat, results))
    )

    // Devolver los resultados después de que todas las categorías hayan sido procesadas
    return results
  } catch (error) {
    console.error('Ha ocurrido un error:', error)
    throw error
  }
}
