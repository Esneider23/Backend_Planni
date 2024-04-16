import { Router } from 'express'
import { scrapeWebsiteController } from './controller.js'

const packageRouter = Router()

packageRouter.post('/', scrapeWebsiteController)

export { packageRouter }
