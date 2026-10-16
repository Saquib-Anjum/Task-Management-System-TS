import { env } from "./env.js";
import mongoose from "mongoose";
import logger from './logger.js'
const connectDB = async ():Promise<void> => {
  try {
    mongoose.connection.on("connected", () => {
      logger.info("DB CONNECTED ");
    });
    await mongoose.connect(env.MONGODB_URI);
  } catch (err:unknown) {
    if(err instanceof Error){
      console.log("connection failed",err.message);
    }else{
      console.log("connection failed",err)
    }
  }
};

export default connectDB;
