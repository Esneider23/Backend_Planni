import { Router } from 'express'
import { setCheckoutController} from './controller.js'

const checkoutRouter = Router()

checkoutRouter.post('/', setCheckoutController)

export { checkoutRouter }