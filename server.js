import express from 'express'

const app = express()
import dotenv from 'dotenv'

dotenv.config()

import 'express-async-errors'

//db and authenticate user
import connectDB from "./db/connect.js";

//routers
import authRouter from './routes/authRoutes.js'
import jobsRouter from './routes/jobRoutes.js'

//middleware
import notFound from "./middleware/not-found.js";
import errorHandler from "./middleware/error-handler.js";

app.use(express.json())

app.get('/', (req, res) => {
    // throw new Error('new error');
    res.send('Welcome');
})

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', jobsRouter)


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