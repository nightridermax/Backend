import express from 'express';
import cors from 'cors';
import cookieparser from 'cookie-parser';

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    Credential: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.static("Public"))
app.use(express.urlencoded({extended, limit: "16kb"}))

app.use(cookieparser)


export {app}