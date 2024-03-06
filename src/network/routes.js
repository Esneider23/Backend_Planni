import { Router } from 'express'
import { signUpRouter } from '../components/sing-up/network.js'
import { signInRouter } from '../components/sing-in/network.js'

export const router = (app) => {
  const router = Router()
  router.use('/sign-up', signUpRouter)
  router.use('/sign-in', signInRouter)

  app.use('/planni', router)
}
