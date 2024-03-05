import { Router }from 'express';
import { signUpRouter } from '../components/sing-up/network.js';


export const router = (app) => {
    const router = Router();
    router.use('/', signUpRouter)

    app.use('/planni/sign-up', router)
}