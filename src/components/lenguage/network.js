import { Router } from 'express'
import { getActivity } from './controller.js'

const lenguageRouter = Router()

lenguageRouter.get('/getActivity', getActivity)

export { lenguageRouter }
