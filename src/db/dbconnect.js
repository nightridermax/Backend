import mongoose from 'mongoose';
import { db_name } from '../constants.js';

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${db_name}`)
        console.log(`\n MongoDB connected !! DB Host: ${connectionInstance.connection.host}`);
        // console.log(connectionInstance);
    } catch (error) {
        console.log('MongoDB connection failed.', error);
        process.exit(1)
    }
}

export default connectDB;