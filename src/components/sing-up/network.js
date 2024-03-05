import { Router } from 'express'
import { registryUserClient, registryOtherUserType, registrySupplierUser } from './controller.js'

const signUpRouter = Router()

signUpRouter.post('/sign-up/client', registryUserClient)
signUpRouter.post('/sign-up/other', registryOtherUserType)
signUpRouter.post('/sign-up/supplier', registrySupplierUser)

export { signUpRouter }
