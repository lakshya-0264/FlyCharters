import { Distance_Model } from "../../Models/DistanceModel.js";
import { asynchandler } from "../../Helpers/asynchandler.js";
import { multi_leg_model } from "../../Models/Multi_LegModel.js";
import { parking_charges } from "../../Helpers/other_info.js";
async function cost_calculator_multi(base_loc_id, departure_airport_id,between_airport_id,arrival_airport_id,staying_time,aircraft_speed, priceperhour) {
    try {
        let airport = [];
        airport.push(base_loc_id)
        if(base_loc_id!=departure_airport_id){
            airport.push(departure_airport_id)
        }
        if(airport[airport.length-1]!=between_airport_id){
            airport.push(between_airport_id)
        }
        if(airport[airport.length-1]!=arrival_airport_id){
            airport.push(arrival_airport_id)
        }
        if(airport[airport.length-1]!=base_loc_id){
            airport.push(base_loc_id)
        }
        // Handle trip routing
        let distanceNM = 0;
        let legdistance = [];
        let legtimes = [];
        let total_time = 0;

        for (let i = 0; i < airport.length - 1; i++) {
            const depart_id = airport[i];
            const arrive_id = airport[i + 1];

            const distance_details = await Distance_Model.findOne({
                $or: [
                    { from: depart_id, to: arrive_id },
                    { from: arrive_id, to: depart_id }
                ]
            });

            if (!distance_details) {
                return null;
            }

            const distance = distance_details.distance;
            distanceNM += distance;
            legdistance.push(distance);

            const time = distance / aircraft_speed;
            legtimes.push(+time.toFixed(2));
            total_time += time;
        }
        // Add stopover time (30 mins per stop except final leg)
        const stopOverMinutes = Math.max(0, (legdistance.length - 1)) * 30;
        total_time += stopOverMinutes / 60;
        total_time+=staying_time-1 // staying time should be in hrs
        const total_cost = total_time * priceperhour+((staying_time-1)*parking_charges);

        return {
            total_cost: +total_cost.toFixed(2),
            total_time: +total_time.toFixed(2),
            total_distance: +distanceNM.toFixed(2),
            leg_distances: legdistance,
            leg_times: legtimes
        };
    } catch (err) {
        console.error("Error in cost_calculator:", err.message);
        throw err;
    }
}
const generate_quota_multi_leg = asynchandler(async (req, res) => {
    const { fleet_request_id } = req.params
    if (!fleet_request_id) {
        return res.status(400).json({ message: "fleet_request_ticket is required" })
    }
    const { deparature_airport_id,between_airport_id,destinationAirportId,staying_time } = req.body
    if (!deparature_airport_id || !destinationAirportId || !between_airport_id || !staying_time) {
        return res.status(400).json({ message: "deparature_airport_id or destinationAirport or between_airport_id or staying time  is missing" })
    }
    const fleet = await FleetModel.findById(fleet_request_id)
    if (!fleet) {
        return res.status(404).json({ message: "fleet not found" })
    }
    const base_loc_id = fleet.aircraftBase
    const price_per_hour = fleet.price_per_hour
    const speed = fleet.cruisingSpeed
    const departure_airport_id = deparature_airport_id
    const arrival_airport_id = destinationAirportId
    const result = await cost_calculator_multi(base_loc_id, departure_airport_id,between_airport_id,arrival_airport_id,staying_time,speed, price_per_hour)
    const cost_with_gst = (result.total_cost * gst / 100) + result.total_cost
    const create_quota = await multi_leg_model.create({
        fleet_request_id: fleet_request_id,
        total_cost: result.total_cost,
        total_cost_with_gst: cost_with_gst,
        total_distance: result.total_distance,
        total_time: result.total_time,
        leg_distance: result.leg_distances,
        leg_time: result.leg_times,
        deparature_airport_id: deparature_airport_id,
        destination_airport_id: destinationAirportId,
        departureTime: flight.departureTime,
        departureDate: flight.departureDate,
        between_airport_id:between_airport_id
    })
    if (!create_quota) {
        return res.status(500).json({ message: "Error in generating quota" })
    }
    return res.status(200).json(new ApiResponse(200, true, "quota created succcessfully", create_quota))
}
)
const get_all_multi_leg_quota = asynchandler(async (req, res) => {
    const result = await multi_leg_model.find()
    if (!result) {
        return res.status(404).json({ message: "No quota found" })
    }
    return res.json({ message: "fetched all quotes", status: 200, data: result })
})
const get_quota_by_operator_id = asynchandler(async (req, res) => {
    // const { operator_id } = req.params
    // if (!operator_id) {
    //     return res.status(400).json({ message: "operator_id is required" })
    // }
    const data = await multi_leg_model.aggregate([
        {
            $lookup: {
                from: "fleets",
                localField: "fleet_request_id",
                foreignField: "_id",
                as: "fleet"
            }
        },
        { $unwind: "$fleet" },
        {
            $match: {
                "fleet.operatorId": new mongoose.Types.ObjectId(req.user._id)
            }
        }
    ])
    //console.log(data);
    return res.json({ message: "", success: true, data: data })

})
async function generate_quote_flight(fleet_id, total_cost, total_time, total_distance, leg_distance, leg_time, deparature_airport_id,between_airport_id,destination_airport_id, departureDate, departureTime) {
    try {
        const cost_with_gst = (total_cost * gst / 100) + total_cost
        const quote_create = await Quote_Model.create({
            fleet_request_id: fleet_id,
            total_cost: total_cost,
            total_cost_with_gst: cost_with_gst,
            total_time: total_time,
            total_distance: total_distance,
            leg_distance: leg_distance,
            leg_time: leg_time,
            deparature_airport_id: deparature_airport_id,
            destination_airport_id: destination_airport_id,
            departureDate: departureDate,
            departureTime: departureTime,
            between_airport_id:between_airport_id
        })
        if (!quote_create) {
            throw new ApiError(400, "Failed to create quote")
        }
        return quote_create
    }
    catch {
        console.log(err)
    }

}
export {generate_quota_multi_leg,get_all_multi_leg_quota,get_quota_by_operator_id}