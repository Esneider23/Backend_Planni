import { Router } from 'express'
import { getActivity } from './controller.js'

const lenguageRouter = Router()

lenguageRouter.post('/getActivity', getActivity)

export { lenguageRouter }
