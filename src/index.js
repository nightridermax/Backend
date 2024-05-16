import dotenv from "dotenv"
// require('dotenv').config({path: './env'});
import connectDB from './db/dbconnect.js';

dotenv.config({
    path: ',/env'
})

const port = process.env.PORT || 8000;

connectDB()
.then(() => {
    app.listen(port, ()=>{
        console.log(`server is live on port: ${port}`);
    })
})
.catch((err) => {
    console.log('DB Connection failed', err);
})