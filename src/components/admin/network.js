import { Router } from 'express'
import { AllUsersController, createUserController, deleteUserController, updateUserController, createPackageController, deletePackageController } from './controller.js'

const userAdminRouter = Router()

userAdminRouter.get('/users', AllUsersController)
userAdminRouter.post('/users', createUserController)
userAdminRouter.delete('/users/:id', deleteUserController)
userAdminRouter.put('/users/:id', updateUserController)

userAdminRouter.post('/package', createPackageController)
userAdminRouter.delete('/package/:id', deletePackageController)




export { userAdminRouter }