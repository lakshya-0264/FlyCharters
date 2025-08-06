import mongoose from "mongoose";
const Quote_Schema=new mongoose.Schema({
    fleet_request_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Fleet",
    },
    status:{
        type:String,
        enum:["approved","rejected"],
        default:"approved"
    },
    total_cost:{
        type:Number,
        required:true
    },
    total_cost_with_gst:{
        type:Number,
        required:true
    },
    total_time:{
        type:Number,
        required:true
    },
    total_distance:{
        type:Number,
        required:true,
    },
    leg_distance:{
        type:[Number],
        required:true
    },
    leg_time:{
        type:[Number],
        required:true
    },
    deparature_airport_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Airport"
    },
    destination_airport_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Airport"
    },
    departureDate:{
        type:String,
        required:true
    },
    departureTime:{
        type:String,
        required:true
    },

},{timestamps:true})
const Quote_Model=mongoose.model("Quote_Model",Quote_Schema)
export {Quote_Model}