import { Router } from 'express'
import { scrapeWebsite } from './controller.js'

const packageRouter = Router()

packageRouter.post('/', scrapeWebsite)

export { packageRouter }
