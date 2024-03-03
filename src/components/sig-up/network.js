import { Router } from 'express'
import { registryUserClient } from './controller.js'

const signUpRouter = Router()

signUpRouter.post('/sign-up', registryUserClient)

export { signUpRouter }
