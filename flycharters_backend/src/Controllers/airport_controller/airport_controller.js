import { asynchandler } from "../../Helpers/asynchandler.js";
import { ApiResponse } from "../../Helpers/apiresponse.js";
import { ApiError } from "../../Helpers/apierror.js";
import { AirportModel } from "../../Models/AirportModel.js";
// 
const get_details_all_airports=asynchandler(async(req,res)=>{
    const all_airports=await AirportModel.find();
    if(!all_airports){
        throw new ApiError(500,"some error while fetching the data")
    }
    return res.json(new ApiResponse(200,true,"all the airports_details_fetched",all_airports))
})
const get_airport_by_id = asynchandler(async (req, res) => {
    const { id } = req.params;

    const airport = await AirportModel.findById(id);

    if (!airport) {
        throw new ApiError(404, "Airport not found");
    }

    return res.json(new ApiResponse(200, true, "Airport fetched successfully", airport));
});

// 
const add_airports_details=asynchandler(async(req,res)=>{
    const {airport_name,source_IATA,source_gps, source_lat,source_lon,classification,hour_of_operation}=req.body
    if(!airport_name || !source_IATA || !source_gps || !source_lat || !source_lon || !classification || !hour_of_operation){
        throw new ApiError(400,"some details are missing")
    }
    const new_airport=await AirportModel.create({
       airport_name:airport_name,
       source_IATA:source_IATA,
       source_gps:source_gps,
       source_lat:source_lat,
       source_lon:source_lon,
       classification:classification,
       hour_of_operation:hour_of_operation
    })
    return res.json(new ApiResponse(200,true,"airport is addded successfully",new_airport))
})
// 
const update_airport_details=asynchandler(async(req,res)=>{
    const {airport_id}=req.params
    const airport=await AirportModel.findByIdAndUpdate(airport_id,{$set:req.body},{new:true,runValidators:true})
    console.log(airport)
    if(!airport){
        throw new ApiError(500,"some error while updating the airport")
    }
    return res.json(new ApiResponse(200,"airport details updated successfully",airport))
})
// 
const delete_airport=asynchandler(async(req,res)=>{
    const {airport_id}=req.params;
    const airport=await AirportModel.findByIdAndDelete(airport_id);
    if(!airport){
        throw new ApiError(500,"some error while deleting the airport")
    }
    return res.json(new ApiResponse(200,true,"airport is deleted successfully"))
})
const bulk_creation=asynchandler(async(req,res)=>{
    const {airports}=req.body
    if(!airports){
        return res.status(400).json({message:"some fields are missing"})
    }
    const result=await AirportModel.insertMany(airports,{ordered:false})
    return res.status(200).json({
      message: "Airports inserted successfully",
      insertedCount: result.length,
      data: result
    });
})
export {get_details_all_airports,add_airports_details,update_airport_details,delete_airport,bulk_creation, get_airport_by_id}