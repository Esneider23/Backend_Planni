import { Router } from 'express'
import { scrapeWebsiteController, getPackage, getPackages } from './controller.js'

const packageRouter = Router()

packageRouter.post('/', scrapeWebsiteController)
packageRouter.get('/:id', getPackage)
packageRouter.get('/', getPackages)

export { packageRouter }
