import { Router } from 'express'
import { getTrip } from './controller.js'

const getTripRoute = Router()

getTripRoute.get('/', getTrip)

export { getTripRoute }
