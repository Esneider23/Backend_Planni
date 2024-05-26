import { Router } from 'express'
import { signUpRouter } from '../components/sing-up/network.js'
import { signInRouter } from '../components/sing-in/network.js'
import { packageRouter } from '../components/package/network.js'
import { userRouter } from '../components/user/network.js'
import { checkoutRouter } from '../components/checkout/network.js'
import { userAdminRouter } from '../components/admin/network.js'

export const router = (app) => {
  const router = Router()
  router.use('/sign-up', signUpRouter)
  router.use('/sign-in', signInRouter)
  router.use('/package', packageRouter)
  router.use('/user', userRouter)
  router.use('/admin', userAdminRouter)
  router.use('/checkout', checkoutRouter)
  app.use('/planni', router)
}
