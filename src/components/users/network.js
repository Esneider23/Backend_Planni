import {Router} from 'express'
import { deleteUser, getUserAll, getFilterByRol,
    getFilterByUsername
 } from './controller.js'

const userRouter = Router()

userRouter.get('/', getUserAll)
userRouter.get('/:rol', getFilterByRol)
userRouter.get('/:username', getFilterByUsername)
userRouter.delete('/:id' , deleteUser)



export {userRouter}