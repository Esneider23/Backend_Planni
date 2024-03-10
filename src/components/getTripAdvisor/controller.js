import axios from 'axios'
import { env } from '../../options/env.js'
import { response } from '../../network/response.js'

export const getTrip = async (req, res) => {
    const lyri = ["centro", "snorkel"]
    const stringWords = lyri.join(', ');

    try {
        const api = await axios.get('https://api.content.tripadvisor.com/api/v1/location/nearby_search', {
            params: {
                latLong: '10.4258988,-75.5496305,17',
                searchQuery: stringWords,
                key: env.KEY_TRIPADVISOR,
                radius: '7.9',
                radiusUnit: 'km',
                language: 'es_CO'
              },
            headers: {
                accept: 'application/json'
            }
        });
        const numberSite = api.data.data.length;
        response.success(res, `TripAdvisor API [ ${stringWords} ] | Number of searched sites: ${numberSite}`, api.data, 200)
    } catch (error) {
        console.error("Ha ocurrido un error:", error);
        throw error;
    }
}
