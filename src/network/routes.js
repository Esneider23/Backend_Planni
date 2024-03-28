import { Router } from 'express'
import { signUpRouter } from '../components/sing-up/network.js'
import { signInRouter } from '../components/sing-in/network.js'
import { lenguageRouter } from '../components/lenguage/network.js'
import { getTripRoute } from '../components/getTripAdvisor/network.js'
import { packageRouter } from '../components/package/network.js'

export const router = (app) => {
  const router = Router()
  router.use('/sign-up', signUpRouter)
  router.use('/sign-in', signInRouter)
  router.use('/lenguage', lenguageRouter)
  router.use('/trip', getTripRoute)
  router.use('/package', packageRouter)
  app.use('/planni', router)
}
