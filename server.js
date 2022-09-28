import express from 'express'

const app = express()
import dotenv from 'dotenv'

dotenv.config()

import 'express-async-errors'
import morgan from 'morgan'

import {dirname} from 'path'
import {fileURLToPath} from 'url'
import path from 'path'

import helmet from "helmet";
import xss from "xss-clean"
import mongoSanitize from "express-mongo-sanitize"

//db and authenticate user
import connectDB from "./db/connect.js";

//routers
import authRouter from './routes/authRoutes.js'
import jobsRouter from './routes/jobRoutes.js'

//middleware
import notFound from "./middleware/not-found.js";
import errorHandler from "./middleware/error-handler.js";
import authenticateUser from "./middleware/auth.js";


app.use(express.json())
app.use(helmet()) //Helmet helps you secure your Express apps by setting various HTTP headers.
app.use(xss()) //Node.js Connect middleware to sanitize user input coming from POST body, GET queries, and url params.
app.use(mongoSanitize()) //Sanitizes user-supplied data to prevent MongoDB Operator Injection.

if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'))
}

app.use(express.json())


const __dirname = dirname(fileURLToPath(import.meta.url))

app.use(express.static(path.resolve(__dirname, './client/build')))

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authenticateUser, jobsRouter)

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './client/build', 'index.html'))
})


app.use(notFound)

app.use(errorHandler)

const port = process.env.PORT || 5000;


const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL)
        app.listen(port, () => console.log(`Server is listening on port ${port}`))
    } catch (e) {
        console.log(e)
    }
}

start();