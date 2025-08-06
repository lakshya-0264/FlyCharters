import mongoose from "mongoose"
const airportSchema = new mongoose.Schema({
    airport_name: {
        type: String,
        required: true,
        unique:true
    },
    source_IATA: {
        type: String,
        required: true
    },
    source_gps:{
        type:String,
        required:true
    },
    source_lat:{
        type:Number,
        required:true
    },
    source_lon:{
        type:Number,
        required:true
    },
    classification:{
        type:String,
        enum:["Controlled","UnControlled"],
        required:true
    },
    hour_of_operation:{
        type:String,
        required:true
    }
}, {
    timestamps: true
});
const AirportModel=mongoose.model('Airport',airportSchema)
export {AirportModel}