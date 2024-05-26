import { Router } from 'express'
import { AllUsersController, createUserController, deleteUserController, updateUserController } from './controller.js'

const userAdminRouter = Router()

userAdminRouter.get('/users', AllUsersController)
userAdminRouter.post('/users', createUserController)
userAdminRouter.delete('/users/:id', deleteUserController)
userAdminRouter.put('/users/:id', updateUserController)

userAdminRouter.post('/package', )




export { userAdminRouter }