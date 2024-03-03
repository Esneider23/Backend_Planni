import { Router } from 'express'
import { registryUserClient } from './controller.js'

const testRouter = Router()

testRouter.post('/sign-up', registryUserClient)

export { testRouter }
