import { Router } from 'express'
import { getUserController, updateUserController, deleteUserController, favoritoController, getHistoryController } from './controller.js'

const userRouter = Router()

userRouter.get('/client', getUserController)
userRouter.put('/client', updateUserController)
userRouter.delete('/client', deleteUserController) 
userRouter.post('/favorites', favoritoController) 
userRouter.get('/client/history', getHistoryController) 



export { userRouter }