import {Router} from 'express'
import { deleteUser, getUserAll, getFilterByRol,
    getFilterByUsername,
    updateUser,
    buysPackage,
    createPackageController,
    deletePackageController,
    updatePackageController
 } from './controller.js'

const userRouter = Router()

userRouter.get('/', getUserAll)
userRouter.get('/filter/rol/:rol', getFilterByRol)
userRouter.get('/filter/user/:name', getFilterByUsername)
userRouter.put('/:id' , updateUser)
userRouter.delete('/:id' , deleteUser)
userRouter.post('/buys', buysPackage )

userRouter.post('/package', createPackageController)
userRouter.delete('/package/:id', deletePackageController)
userRouter.put('/package/:id', updatePackageController)

export {userRouter}