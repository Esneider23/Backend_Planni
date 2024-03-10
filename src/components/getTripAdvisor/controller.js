import axios from 'axios'
import { env } from '../../options/env.js'
import { response } from '../../network/response.js'

export const getTrip = async (req, res) => {
    try {
        const api = await axios.get('https://api.content.tripadvisor.com/api/v1/location/search', {
            params: {
                searchQuery: 'snorkel en cartagena',
                key: env.KEY_TRIPADVISOR,
                category: 'hotels',
                radius: '7.90',
                radiusUnit: 'm',
                language: 'es_Col'
            },
            headers: {
                accept: 'application/json'
            }
        });
        response.success(res, 'TripAdvisor API', api.data, 200)
    } catch (error) {
        console.error("Ha ocurrido un error:", error);
        throw error;
    }
}
