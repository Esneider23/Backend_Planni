import { Router } from 'express'
import {
  deleteUser,
  getUserAll,
  getFilterByRol,
  getFilterByUsername,
  updateUser,
  buysPackage,
  createPackageController,
  deletePackageController,
  updatePackageController,
  getHistoryController,
  getUserByEmail
} from './controller.js'

const userRouter = Router()

userRouter.get('/:email', getUserByEmail)
userRouter.put('/:id', updateUser)
userRouter.delete('/:id', deleteUser)
userRouter.get('/', getUserAll)
userRouter.get('/filter/rol/:rol', getFilterByRol)
userRouter.get('/filter/user/:name', getFilterByUsername)
userRouter.post('/buys', buysPackage)

userRouter.post('/package', createPackageController)
userRouter.delete('/package/:id', deletePackageController)
userRouter.put('/package/:id', updatePackageController)
userRouter.get('/history/:id', getHistoryController)

export { userRouter }
