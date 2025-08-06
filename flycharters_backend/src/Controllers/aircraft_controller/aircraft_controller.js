import { AircraftModel } from "../../Models/aircraftModel.js";
import { asynchandler } from "../../Helpers/asynchandler.js";
import { uploadfile, deletefile } from "../../Helpers/cloudinary_utils/cloud_utils.js";
import { ApiError } from "../../Helpers/apierror.js";
import { ApiResponse } from "../../Helpers/apiresponse.js";
import User from "../../Models/userModel.js";
import { FlightModel } from "../../Models/flightsModel.js";
import AircraftCapability from '../../Models/AircraftCapability.js'
import { notifyByEmail } from "../../Helpers/email.js";
import { GenericEmailTemplate } from "../../Helpers/htmlEmail.js";


const AddAircraft = asynchandler(async (req, res) => {
    const {fleetid}=req.params
    if(!fleetid){
        throw new ApiError(400,"fleet id is missing")
    }
    const {name, aircraftType, manufacture_year,seating_capacity, cruising_speed,cruising_level,aircraft_base,pilots,cabinCrew,flyingRange}=req.body
    if(!req.files){
         throw new ApiError("Aircraft images are missing")
    }
    let document_response = []
    for (let i = 0; i < req.files.length; i++) {
        const file = await uploadfile(req.files[i].path)
        document_response.push(file.url)
    }
    const AirCraft_Model=await AircraftModel.create({
        fleet_id:fleetid,
        operatorid:req.user._id,
        name:name,
        aircraftType:aircraftType,
        manufacture_year:manufacture_year,
        seating_capacity:seating_capacity,
        cruising_speed:cruising_speed,
        cruising_level:cruising_level,
        aircraft_base:aircraft_base,
        pilots:pilots,
        cabinCrew:cabinCrew,
        flyingRange:flyingRange,
        flight_image:document_response

    })
    return res.json(new ApiResponse(200,true,"AirCraft added successfully",AirCraft_Model))
})
const DeleteAircraft = asynchandler(async (req, res) => {
    const { aircraft_id } = req.params
    const aircraft = await AircraftModel.findById(aircraft_id)
    if (!aircraft) {
        throw new ApiError(400, "aircraft not found")
    }
    // if (aircraft.operatorid != req.user._id) {
    //     throw new ApiError(400, "you are unauthorised to this")
    // }
    let aircraft_base = aircraft.flight_image
    for (let i = 0; i < aircraft_base.length; i++) {
        await deletefile(aircraft_base[i]);
    }
    await AircraftModel.findByIdAndDelete(aircraft_id)
    return res.json(new ApiResponse(200, true, "aircraft id delete successfully"))
})
const UpdateAllAirCraft = asynchandler(async (req, res) => {
    const { aircraft_id } = req.params
    const aircraft = await AircraftModel.findById(aircraft_id)
    if (!aircraft) {
        throw new ApiError(400, "aircraft not found")
    }
    if (aircraft.operatorid != req.user._id) {
        throw new ApiError(400, "you are unauthorised to this")
    }
    const aircraft_new = await AircraftModel.findByIdAndUpdate(
        aircraft_id,
        { $set: req.body },
        { new: true, runValidators: true }
    );
    if(!aircraft_new){
        throw new ApiError(400, "aircraft not found")
    }
    return res.json(new ApiResponse(200,true,"Aircraft details upgraded",UpdateAllAirCraft))

})
const GetAllAirCraft = asynchandler(async (req, res) => {
    const aircrafts = await AircraftModel.find().populate("fleet_id").populate("operatorid")
    if (!aircrafts) {
        throw new ApiError(500, "some error in fetching the documents")
    }
    return res.json(new ApiResponse(200, "all the aircraft fetched", aircrafts))
})
const GetAirCraftById = asynchandler(async (req, res) => {
    const { Aircraft_id } = req.params
    const aircraft = await AircraftModel.findById(Aircraft_id).populate("fleet_id").populate("operatorid")
    if (!aircraft) {
        throw new ApiError(404, "aircraft not found")
    }
    return res.json(new ApiResponse(200,true,"aircraft fetched successfully",aircraft))
})
const GetAirCraftByFleetId = asynchandler(async (req, res) => {
    const { fleet_id } = req.params
    const aircrafts = await AircraftModel.find({ fleet_id: fleet_id }).populate("fleet_id").populate("operatorid")
    if (!aircrafts) {
        throw new ApiError(404, "aircraft not found")
    }
    return res.json(200, "all craft fetched successfully", aircrafts)

})
const GetAirCraftByOperatorId = asynchandler(async (req, res) => {
    const aircrafts = await AircraftModel.find({ operatorid: req.user._id }).populate("fleet_id").populate("operatorid")
    if (!aircrafts) {
        throw new ApiError(404, "aircraft not found")
    }
    return res.json(new ApiResponse(200, "all craft fetched successfully", aircrafts))
})

const normalizeTime = (time) => {
  if (!time) return time;
  const [hours, minutes] = time.split(':');
  return `${hours.padStart(2, '0')}:${minutes}`;
};
const createCapabilities = async (req, res) => {
  try {
    const { aircraft_id, from_airport, status, note, date_from, date_to, time_from, time_to } = req.body;
    if (!aircraft_id?.length || !from_airport?.length || !status) {
      return res.status(400).json({
        error: 'Missing required fields: aircraft_id, from_airport, or status'
      });
    }
    const startDate = new Date(date_from);
    const endDate = new Date(date_to);
    if (startDate > endDate) {
      return res.status(400).json({
        error: 'End date must be after start date'
      });
    }

    const capabilities = [];
    const errors = [];
    for (const aircraftId of aircraft_id) {
      for (const airportId of from_airport) {
        try {
          const [aircraft, airport] = await Promise.all([
            Fleet.findById(aircraftId),
            Airport.findById(airportId)
          ]);

          if (!aircraft) {
            errors.push(`Aircraft not found: ${aircraftId}`);
            continue;
          }
          if (!airport) {
            errors.push(`Airport not found: ${airportId}`);
            continue;
          }

          // Create or update capability
          const capability = await AircraftCapability.findOneAndUpdate(
            {
              aircraft_id: aircraftId,
              airport_id: airportId,
              capability_type: status
            },
            {
              restriction_period: {
                date_from: startDate,
                date_to: endDate,
                time_from: normalizeTime(time_from),
                time_to: normalizeTime(time_to),
                note
              }
            },
            { upsert: true, new: true }
          );

          capabilities.push(capability);
          await notifyAffectedFlights({
            aircraftId,
            airportId,
            capabilityType: status,
            date_from,
            date_to,
            time_from,
            time_to,
            note
          });

        } catch (err) {
          errors.push(`Error processing ${aircraftId}/${airportId}: ${err.message}`);
        }
      }
    }

    if (capabilities.length === 0 && errors.length > 0) {
      return res.status(400).json({
        error: 'Failed to create any capabilities',
        details: errors
      });
    }

    res.json({
      message: 'Capabilities processed successfully',
      created: capabilities.length,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (err) {
    console.error('Error creating capabilities:', err);
    res.status(500).json({
      error: 'Server error',
      message: err.message
    });
  }
};

export {AddAircraft,DeleteAircraft,UpdateAllAirCraft,GetAirCraftByFleetId,GetAllAirCraft,GetAirCraftById,GetAirCraftByOperatorId,createCapabilities}