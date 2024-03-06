import { Router } from 'express'
import {
  registryUserClient,
  registryOtherUserType,
  registrySupplierUser
} from './controller.js'

const signUpRouter = Router()

signUpRouter.post('/client', registryUserClient)
signUpRouter.post('/other', registryOtherUserType)
signUpRouter.post('/supplier', registrySupplierUser)

export { signUpRouter }
