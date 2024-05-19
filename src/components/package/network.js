import { Router } from 'express'
import { scrapeWebsiteController, getPackages } from './controller.js'

const packageRouter = Router()

packageRouter.post('/', scrapeWebsiteController)
packageRouter.get('/:id', getPackages)

export { packageRouter }
