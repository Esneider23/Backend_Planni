import {Router} from 'express'
import { deleteUser, getUserAll, getFilterByRol,
    getFilterByUsername
 } from './controller.js'

const userRouter = Router()

userRouter.get('/', getUserAll)
userRouter.get('/filter/rol/:rol', getFilterByRol)
userRouter.get('/filter/user/:name', getFilterByUsername)
userRouter.delete('/:id' , deleteUser)



export {userRouter}