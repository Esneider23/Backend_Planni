import { Router }from 'express';
import { testRouter } from '../components/registry/network.js';


export const router = (app) => {
    const router = Router();
    router.use('/', testRouter)

    app.use('/api/v1', router)
}