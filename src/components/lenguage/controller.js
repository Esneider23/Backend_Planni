import { response } from '../../network/response.js'
import city from './json/context-city.json' assert { type: 'json' }
import key from './json/key.json' assert { type: 'json' }
import actions from './json/action.json' assert { type: 'json' }
import { pipeline } from '@xenova/transformers'

const searchCity = (cityData, cityName) => {
  return cityData[cityName]
}

const lenguageProcess = async (data_city, data_user) => {
  const answerer = await pipeline(
    'question-answering',
    'iagovar/roberta-base-bne-sqac-onnx'
  )
  const question = '¿Qué puedo hacer en Cartagena según mis intereses?'
  const context_global = data_city + '\n\n' + data_user
  const answer = await answerer(question, context_global)
  return answer.answer
}

const listActivity = async (data) => {
  const keys = key.key
  const action = actions.actions
  const placesAndActions = keys.concat(action).filter((palabra) => data.includes(palabra))
  return placesAndActions
}

export const getActivity = async (req, res) => {
  try {
    const { cityName, context_user } = req.body
    // Use the search function to find the city
    const info = city.city
    const cityInfo = searchCity(info, cityName)

    if (!cityInfo) {
      response.error(res, 'Ciudad no encontrada', 404)
    } else {
      if (context_user === undefined) {
        response.error(res, 'Falta el contexto del usuario', 400)
      }
      const activities = await lenguageProcess(cityInfo, context_user)
      const toTodo = await listActivity(activities)
      response.success(res, 'Actividades encontradas', { activities: toTodo }, 200)
    }
  } catch (error) {
    response.error(res, error.message, 500)
  }
}