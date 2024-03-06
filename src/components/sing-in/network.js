import { Router } from 'express'
import { signIn } from './controller.js'

const signInRouter = Router()

signInRouter.post('/', signIn)

export { signInRouter }
