import mongoose from "mongoose"
import { AirportModel } from "../Models/AirportModel.js";
export async function DBConnection(){
    try{
        const connection=await mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`);
        console.log("Database connection established. Ready for queries.",connection.connection.host)
    }
    catch(err){
        console.log(err);
        process.exit(1);
    }
}