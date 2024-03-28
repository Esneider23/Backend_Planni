import { Router } from 'express'
import { scrapeWebsite } from './controller.js'

const packageRouter = Router()

packageRouter.get('/', scrapeWebsite)

export { packageRouter }
