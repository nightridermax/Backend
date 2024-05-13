import dotenv from "dotenv"
// require('dotenv').config({path: './env'});
import connectDB from './db/dbconnect.js';

dotenv.config({
    path: ',/env'
})

connectDB()