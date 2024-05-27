import axios from 'axios'
import { env } from '../../options/env.js'
import { getActivity } from '../deberta/consumDeberta.js'


const apiBaseTripadvisor = 'https://api.content.tripadvisor.com/api/v1'
const axiosConfig = {
  params: {
    key: env.KEY_TRIPADVISOR,
    latLong: env.LATLONG,
    radius: '7.50',
    radiusUnit: 'km',
    language: 'es_CO'
  },
  headers: {
    accept: 'application/json'
  }
}

const tripAsync = async (infoDeberta, stringWords, category, results) => {
  try {
    const combinedSearchParams = {
      ...axiosConfig.params,
      searchQuery: stringWords,
      category
    }
    const api = await axios.get(
      `${apiBaseTripadvisor}/location/search`, // Cambiar a `${API_BASE_URL}/location/search` para producción
      {
        ...axiosConfig,
        params: combinedSearchParams
      }
    )

    // Si no hay resultados para la búsqueda conjunta, realizar búsquedas individuales
    if (api.data.data.length === 0) {
      const individualResults = await Promise.all(
        infoDeberta.map(async (word) => {
          const individualSearchParams = {
            ...axiosConfig.params,
            searchQuery: word,
            category
          }
          const individualApi = await axios.get(
            `${apiBaseTripadvisor}/location/search`,
            {
              ...axiosConfig,
              params: individualSearchParams
            }
          )
          return individualApi.data.data
        })
      )
      const flattenedResults = individualResults.flat()
      results[category] = flattenedResults
    } else {
      // Almacena los resultados en el objeto por categoría
      results[category] = api.data.data
    }
  } catch (error) {
    console.error('Ha ocurrido un error:', error)
    throw error
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

export const getDescriptionsAndImages = async (locationId) => {
  try {
    const locationDetails = await axios.get(
      `${apiBaseTripadvisor}/location/${locationId}/details`,
      axiosConfig
    )

    const images = await axios.get(
      `${apiBaseTripadvisor}/location/${locationId}/photos`,
      axiosConfig
    )
    if (images.data.data.length > 0) {
      return {
        description: locationDetails.data.description,
        images: images.data.data[0].images.medium.url
      }
    } else {
      throw new Error('No se encontraron imágenes para este lugar.')
    }
  } catch (error) {
    console.error('Error fetching location data:', error)
    throw error
  }
}
