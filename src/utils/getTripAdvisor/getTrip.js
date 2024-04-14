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
            latLong: env.LATLONG,
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

      // Si no hay resultados para la búsqueda conjunta, realizar búsquedas individuales
      if (api.data.data.length === 0) {
        const individualResults = []
        for (const word of infoDeberta) {
          const individualApi = await axios.get(
            'https://api.content.tripadvisor.com/api/v1/location/search',
            {
              params: {
                latLong: env.LATLONG,
                searchQuery: word,
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
          individualResults.push(...individualApi.data.data)
        }
        results[cat] = individualResults
      } else {
        // Almacena los resultados en el objeto por categoría
        results[cat] = api.data.data
      }
    }
    // Devolver los resultados después de que todas las categorías hayan sido procesadas
    return results
  } catch (error) {
    console.error('Ha ocurrido un error:', error)
    throw error
  }
}
