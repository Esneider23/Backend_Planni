import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { router } from './network/routes.js'
import { corsOptions } from './options/cors.js'
import { server } from './utils/server.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors(corsOptions))
app.use(helmet())

router(app)

server(app)
