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
  const placesAndActions = keys
    .concat(action)
    .filter((palabra) => data.includes(palabra))
  return placesAndActions
}

export const getActivity = async (cityName, contextUser) => {
  try {
    const info = city.city
    const cityInfo = searchCity(info, cityName)

    if (!cityInfo) {
      return {
        error: 'No se encontró la ciudad'
      }
    } else {
      if (contextUser === undefined) {
        response.error(res, 'Falta el contexto del usuario', 400)
      }
      const activities = await lenguageProcess(cityInfo, contextUser)
      const toTodo = await listActivity(activities)
      return toTodo
    }
  } catch (error) {
    console.error('Ha ocurrido un error:', error)
    throw error
  }
}
