import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()

const connectMongodb = async () => {
    await mongoose.connect(process.env.MONGODB_URL)
}

export default connectMongodb