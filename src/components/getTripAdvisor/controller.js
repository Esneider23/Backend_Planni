import axios from 'axios'
import { env } from '../../options/env.js'
import { response } from '../../network/response.js'

const consumDeberta = async (req, res) => {
    try {
        const test = await axios.post('http://localhost:3000/planni/lenguage/getActivity', {
            cityName: 'Cartagena',
            context_user: 'Tengo 27 años y soy un amante de la naturaleza y los deportes acuáticos. Disfruto mucho de la playa, ' +
                'especialmente practicando surf y kayak. Me gusta mantenerme activo y pasar el tiempo al aire libre, explorando nuevos' +
                ' lugares y disfrutando de la belleza natural que ofrecen. También me interesa la historia, pero prefiero actividades más enfocadas' +
                ' en la aventura y la naturaleza.'
        });
        console.log(test.data.data.activities);
        return test.data.data.activities;
    } catch (error) {
        console.error('Error al obtener las actividades:', error);
    }
}

export const getTrip = async (req, res) => {
    try {
        const infoDeberta = await consumDeberta();
        const stringWords = infoDeberta.join(', ')
        console.log(infoDeberta);
        const api = await axios.get('https://api.content.tripadvisor.com/api/v1/location/search', {
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

