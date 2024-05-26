import { Router } from 'express'
import {
  registryUserClient,
  registryOtherUserType
} from './controller.js'

const signUpRouter = Router()

signUpRouter.post('/client', registryUserClient)
signUpRouter.post('/other', registryOtherUserType)

export { signUpRouter }
