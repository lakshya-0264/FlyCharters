import { Distance_Model } from "../../Models/DistanceModel.js";
import mongoose from "mongoose";
import { asynchandler } from "../../Helpers/asynchandler.js";
import { FlightModel } from "../../Models/flightsModel.js";
import { Quote_Model } from "../../Models/QuotesModel.js";
import { gst, parking_charges } from "../../Helpers/other_info.js";
import { ApiResponse } from "../../Helpers/apiresponse.js";
import { ApiError } from "../../Helpers/apierror.js";
import { FleetModel } from "../../Models/fleetModel.js";
async function cost_calculator(base_loc_id, departure_airport_id, arrival_airport_id, aircraft_speed, priceperhour) {
    try {
        let airport = [];
        // Handle trip routing
        if (base_loc_id !== arrival_airport_id) {
            if (base_loc_id == departure_airport_id) {
                airport = [base_loc_id, arrival_airport_id, base_loc_id]
            }
            else {
                airport = [base_loc_id, departure_airport_id, arrival_airport_id, base_loc_id]
            }
        } else {
            airport = [base_loc_id, departure_airport_id, base_loc_id]
        }
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

        const total_cost = total_time * priceperhour;

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
async function cost_calculator_round_trip(
    base_loc_id,
    deparature_airport_id,
    arrival_airport_id,
    aircraft_speed,
    price_per_hour,
    stay_time_hour,
    parking_charges
) {
    try {
        let airport = [];

        if (base_loc_id !== arrival_airport_id) {
            // Define trip route
            if (base_loc_id === deparature_airport_id) {
                airport = [base_loc_id, arrival_airport_id];
            } else {
                airport = [base_loc_id, deparature_airport_id, arrival_airport_id];
            }

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

            // Stop-over time: 30 min per stop except return to base
            let stopOverMinutes = Math.max(0, (legdistance.length - 1)) * 30;

            // Make a deep copy before reversing
            let leg_distance_reverse = [...legdistance].reverse();
            let leg_times_reverse = [...legtimes].reverse();

            // Full round-trip route distances and times
            let leg_complete = [...legdistance, ...leg_distance_reverse];
            let legtime_complete = [...legtimes, ...leg_times_reverse];

            let extraStopOver = base_loc_id === deparature_airport_id ? 0 : 30;
            let final_stop_Over_Minutes = stopOverMinutes + extraStopOver;

            total_time = total_time * 2 + final_stop_Over_Minutes / 60;

            const total_cost =
                (total_time * price_per_hour) +
                (stay_time_hour * price_per_hour) +
                (stay_time_hour * parking_charges);

            return {
                total_cost: +total_cost.toFixed(2),
                total_time: +total_time.toFixed(2),
                total_distance: +(distanceNM * 2).toFixed(2),
                leg_distances: leg_complete,
                leg_times: legtime_complete
            };
        } else {
            airport = [base_loc_id, deparature_airport_id]
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
            let leg_distance_reverse = [...legdistance].reverse();
            let leg_times_reverse = [...legtimes].reverse();
            let leg_complete = [...legdistance, ...leg_distance_reverse, ...legdistance, ...leg_distance_reverse]
            let leg_time_complete = [...legtimes, ...leg_times_reverse, ...legtimes, ...leg_times_reverse]
            total_time = total_time * 4 + 1;
            const total_cost = (total_time * price_per_hour)
            return {
                total_cost: +total_cost.toFixed(2),
                total_time: +total_time.toFixed(2),
                total_distance: +(distanceNM * 2).toFixed(2),
                leg_distances: leg_complete,
                leg_times: leg_time_complete
            };


        }
    } catch (err) {
        console.error("Error in cost_calculator_round_trip:", err.message);
        throw err;
    }
}
const generate_quota = asynchandler(async (req, res) => {
    const { fleet_request_id } = req.params
    if (!fleet_request_id) {
        return res.status(400).json({ message: "fleet_request_ticket is required" })
    }
    const { deparature_airport_id, destinationAirportId } = req.body
    if (!deparature_airport_id || !destinationAirportId) {
        return res.status(400).json({ message: "deparature_airport_id and destinationAirport" })
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
    const result = await cost_calculator(base_loc_id, departure_airport_id, arrival_airport_id, speed, price_per_hour)
    const cost_with_gst = (result.total_cost * gst / 100) + result.total_cost
    const create_quota = await Quote_Model.create({
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
        departureDate: flight.departureDate
    })
    if (!create_quota) {
        return res.status(500).json({ message: "Error in generating quota" })
    }
    return res.status(200).json(new ApiResponse(200, true, "quota created succcessfully", create_quota))
}
)
const get_all_quota = asynchandler(async (req, res) => {
    const result = await Quote_Model.find()
    if (!result) {
        return res.status(404).json({ message: "No quota found" })
    }
    return res.json({ message: "fetched all quotes", status: 200, data: result })
})
const get_quota_by_operator_id = asynchandler(async (req, res) => {
    const { operator_id } = req.params
    if (!operator_id) {
        return res.status(400).json({ message: "operator_id is required" })
    }
    const data = await Quote_Model.aggregate([
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
                "fleet.operatorId": new mongoose.Types.ObjectId(operator_id)
            }
        }
    ])
    //console.log(data);
    return res.json({ message: "", success: true, data: data })

})
async function generate_quote_flight(fleet_id, total_cost, total_time, total_distance, leg_distance, leg_time, deparature_airport_id, destination_airport_id, departureDate, departureTime) {
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
            departureTime: departureTime
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
export { cost_calculator, generate_quota, get_all_quota, generate_quote_flight, get_quota_by_operator_id,cost_calculator_round_trip}