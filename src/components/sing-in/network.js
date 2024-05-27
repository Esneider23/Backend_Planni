import { Router } from 'express'
import { signInNew } from './controller.js'

const signInRouter = Router()

signInRouter.post('/', signInNew)

export { signInRouter }
