import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

const app = express()

dotenv.config()
const PORT = process.env.PORT || 9000
const DBURL = process.env.DB
const HOST = process.env.HOST || 'localhost'

app.listen(PORT, HOST, () => {
    console.log(`Server started on ${HOST}:${POST}`);
    mongoose.connect(DBURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(
        _ => {
            console.log('Successfully connected to database');
        }, err => {
            console.log(err);
        }
    )
})

app.use(express.json())
app.use(cors())

app.use('/uploads', express.static('uploads'))