import { asynchandler } from "../../Helpers/asynchandler.js";
import { ApiResponse } from "../../Helpers/apiresponse.js";
import { ApiError } from "../../Helpers/apierror.js";
import { FlightModel } from "../../Models/flightsModel.js";
import { flight_addon } from "../../Helpers/other_flight_data.js";
import { FleetModel } from "../../Models/fleetModel.js";
import { Quote_Model } from "../../Models/QuotesModel.js";
import { NotificationModel } from "../../Models/NotificationModel.js";
import { AirportModel } from "../../Models/AirportModel.js";
import mongoose from "mongoose"; 
import { uploadfile } from "../../Helpers/cloudinary_utils/cloud_utils.js";
import CryptoJS from "crypto-js"
import { addonPrice } from "../../Helpers/add_on_price.js";
import { APP_ID } from "../../Helpers/payment_util.js";
import { SECRET_KEY } from "../../Helpers/payment_util.js";
import { Payment_Model } from "../../Models/paymentModel.js";
const validatePetDetails = async (parsedPet, files) => {
    if (!parsedPet?.isPet) return { isPet: false };
    const { type, specify, weight, sitToTravelCertificate, agreePetPolicy } = parsedPet;
    if (!type?.trim()) throw new Error("Pet type is required");
    if (type === "Other" && !specify?.trim()) throw new Error("Please specify the pet type");
    if (!weight || parseFloat(weight) <= 0) throw new Error("Pet weight must be provided");
    if (!sitToTravelCertificate) throw new Error("Fit-to-travel certificate is required");
    if (!agreePetPolicy) throw new Error("Please accept the pet travel policy");
    const certFile = files?.vaccinationCertificate?.[0];
    if (!certFile) throw new Error("Vaccination certificate is required");
    const uploaded = await uploadfile(certFile.path);
    return {
        isPet: true,
        type,
        specify: type === "Other" ? specify : "",
        weight,
        vaccinationCertificate: [uploaded.secure_url],
        sitToTravelCertificate,
        agreePetPolicy
    };
};

const validateCorporateDetails = (parsedCorp) => {
    if (!parsedCorp?.isCorporate) return { isCorporate: false };

    const { companyName, companyId } = parsedCorp;
    if (!companyName?.trim()) throw new Error("Company name is required");
    if (!companyId?.trim()) throw new Error("Company ID is required");

    return {
        isCorporate: true,
        companyName: companyName.trim(),
        companyId: companyId.trim()
    };
};


// Replace with real validation functions

const create_flight_request = asynchandler(async (req, res) => {
    try {
        // --------- Fleet Object Validation ---------
        let fleet_obj;
        try {
            fleet_obj = JSON.parse(req.body.fleet_obj || "{}");
            if (!fleet_obj.fleet_request_id) throw new Error();
        } catch {
            return res.status(400).json({ success: false, message: "Invalid fleet object" });
        }

        // --------- Passenger Details Validation ---------
        let passengerDetails = [];
        try {
            passengerDetails = JSON.parse(req.body.passengerDetails || "[]");
            if (!Array.isArray(passengerDetails) || passengerDetails.length === 0) {
                return res.status(400).json({ message: "Passenger details are required" });
            }
        } catch {
            return res.status(400).json({ message: "Invalid passenger details format" });
        }

        // --------- Food Service Add-on Validation ---------
        let food_service_details = [];
        try {
            food_service_details = JSON.parse(req.body.food_service_addon || "[]");
            if (!Array.isArray(food_service_details)) throw new Error();
        } catch {
            return res.status(400).json({ message: "Invalid food service add-on format" });
        }

        // --------- Pet Details Validation ---------
        let petDetails = { isPet: false };
        try {
            const parsedPet = JSON.parse(req.body.petDetails || "{}");
            petDetails = await validatePetDetails(parsedPet, req.files);
        } catch (err) {
            return res.status(400).json({ message: err.message });
        }

        // --------- Corporate Details Validation ---------
        let corporateDetails = { isCorporate: false };
        try {
            const parsedCorp = JSON.parse(req.body.corporateDetails || "{}");
            corporateDetails = validateCorporateDetails(parsedCorp);
        } catch (err) {
            return res.status(400).json({ message: err.message });
        }

        // --------- Create Quote Document ---------
        let quote;
        try {
            quote = await Quote_Model.create({
                fleet_request_id: fleet_obj.fleet_request_id,
                total_cost: fleet_obj.total_cost,
                total_cost_with_gst: fleet_obj.total_cost_with_gst,
                total_time: fleet_obj.total_time,
                total_distance: fleet_obj.total_distance,
                leg_distance: fleet_obj.leg_distance,
                leg_time: fleet_obj.leg_time,
                deparature_airport_id: fleet_obj.deparature_airport_id,
                destination_airport_id: fleet_obj.destination_airport_id,
                departureDate: fleet_obj.departureDate,
                departureTime: fleet_obj.departureTime,
            });
        } catch (err) {
            console.error("Quote creation error:", err);
            return res.status(500).json({ success: false, message: "Quote creation failed", error: err.message });
        }

        // --------- Fleet Capacity Check ---------
        let fleet;
        try {
            fleet = await FleetModel.findById(fleet_obj.fleet_request_id);
            if (!fleet) throw new Error("Fleet not found");
        } catch (err) {
            return res.status(500).json({ success: false, message: "Fleet fetch failed", error: err.message });
        }

        const additionalSeats = petDetails?.isPet ? 1 : 0;
        if (fleet.capacity < passengerDetails.length + additionalSeats) {
            return res.status(400).json({ success: false, message: "Passenger + Pet exceed flight capacity" });
        }

        // --------- Parse other fields ---------
        const is_round_trip = req.body.is_round_trip === "true" || req.body.is_round_trip === true;
        const party_addon = JSON.parse(req.body.party_addon || "{}");
        const handling_fee = parseFloat(req.body.handling_fee);

        // --------- Create Flight ---------
        let flight;
        try {
            flight = await FlightModel.create({
                quote_id: quote._id,
                user_id: req.user._id,
                handling_fee:flight_addon.handling_fee,
                passengerDetails: passengerDetails.map(p => ({
                    name: p.name,
                    nationality: p.nationality,
                    ...(p.email && { email: p.email }),
                    ...(p.phone && { phone: p.phone }),
                    ...(p.passport && { passport: p.passport }),
                    ...(p.gender && { gender: p.gender })
                })),
                petDetails,
                corporateDetails,
                is_round_trip,
                transport_facility: req.body.transport_facility == "1",
                party_addon,
                food_service_addon: food_service_details.map(p => ({
                    name: p.name,
                    food_type: is_round_trip ? {
                        departure_way: p.departure_way,
                        arrival_way: p.arrival_way
                    } : {
                        departure_way: p.departure_way
                    },
                    route: is_round_trip ? p.route : "departure_way"
                }))
            });

            if (!flight) {
                return res.status(400).json({ success: false, message: "Flight creation failed" });
            }

            // Generate PNR
            const hash = CryptoJS.SHA256(flight._id.toString()).toString().toUpperCase();
            const pnr = `FC${hash.slice(0, 4)}${hash.slice(-4)}`;
            flight.pnr = pnr;
            await flight.save();
        } catch (err) {
            console.error("❌ Flight creation error:", err);
            return res.status(500).json({ success: false, message: "Flight creation failed", error: err.message });
        }

        return res.status(200).json(new ApiResponse(200, true, "Flight created successfully", flight));
    } catch (err) {
        console.error("❌ Unhandled flight create error:", err);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
});

const get_all_flights = asynchandler(async (req, res) => {
    const flight = await FlightModel.find()
        .populate({
            path: "quote_id",
            populate: [
                {
                    path: "deparature_airport_id",
                    model: "Airport"
                },
                {
                    path: "destination_airport_id",
                    model: "Airport"
                }
            ]
        })
        .populate("user_id");
        
    if (!flight) {
        return new ApiError(404, "No flights found");
    }
    return res.json(new ApiResponse(200, true, "all flights fetched", flight));
});

const get_flight_user_id = asynchandler(async (req, res) => {
    const flight = await FlightModel.find({ user_id: req.user._id })
        .populate({
            path: "quote_id",
            populate: [
                {
                    path: "deparature_airport_id",
                    model: "Airport"
                },
                {
                    path: "destination_airport_id", 
                    model: "Airport"
                }
            ]
        })
        .populate("user_id");

    if (!flight || flight.length === 0) {
        return res.status(404).json(new ApiResponse(404, false, "No flights found", []));
    }

    return res.status(200).json(new ApiResponse(200, true, "flights booked by id", flight));
});

const get_flight_quoto_id = asynchandler(async (req, res) => {
    const { quote_id } = req.params;
    if (!quote_id) {
        return new ApiError(400, "Please fill all the fields");
    }
    const flight = await FlightModel.find({ quote_id: quote_id })
        .populate({
            path: "quote_id",
            populate: [
                {
                    path: "deparature_airport_id",
                    model: "Airport"
                },
                {
                    path: "destination_airport_id",
                    model: "Airport"
                }
            ]
        })
        .populate("user_id");
    return res.json(new ApiResponse(200, true, "flight by quote fetched", flight));
});

const get_flight_status = asynchandler(async (req, res) => {
    const { status } = req.params;
    if (!status) {
        return new ApiError(400, "Please fill all the fields");
    }
    const flight = await FlightModel.find({ status: status }).populate("quote_id").populate("user_id");
    return res.json(new ApiResponse(200, true, "all the flight with given status fetched", flight))
})
const cancel_flight = asynchandler(async (req, res) => {
    const { id } = req.params;
    const flight = await FlightModel.findByIdAndUpdate(
        id,
        { payment_status: "cancelled" },
        { new: true }
    );
    if (!flight) throw new ApiError(404, "Flight not found");
    return res
        .status(200)
        .json(new ApiResponse(200, true, "Flight cancelled", flight));
});

//TODO:Update the logic of flight
const update_flight_addons = asynchandler(async (req, res) => {
    const { party_addon, transport_facility, food_service_addon } = req.body;
    const { flight_id } = req.params;

    const flight = await FlightModel.findById(flight_id);
    if (!flight) throw new ApiError(404, 'Flight not found');

    if (flight.payment_status !== 'booked') {
        throw new ApiError(400, 'Flight is not booked');
    }

    const payment_addons = {
        party_addon_amount: 0,
        transport_facility_amount: 0,
        food_service_addon_amount: 0,
    };

    const round_trip = flight.is_round_trip;
    //
    // 🟢 PARTY ADDON
    //
    if (party_addon) {
        const pricePerLeg = addonPrice.party_addon[party_addon.event_name] || 0;

        if (round_trip) {
            if (party_addon.route === 'both') {
                payment_addons.party_addon_amount = pricePerLeg * 2;
            } else {
                payment_addons.party_addon_amount = pricePerLeg;
            }
        } else {
            payment_addons.party_addon_amount = pricePerLeg;
        }
    }

    //
    // 🟢 FOOD SERVICE ADDON — Merge with existing
    //
    if (food_service_addon && Array.isArray(food_service_addon)) {
        for (const addon of food_service_addon) {
            const { name, route, food_type } = addon;
            if (!name || !route || !food_type) {
                throw new ApiError(400, 'Invalid food_service_addon structure.');
            }
            if (!round_trip && route !== 'departure_way') {
                throw new ApiError(
                    400,
                    'Arrival_way or both routes not allowed because flight is not round-trip.'
                );
            }

            let newAmount = 0;
            if (route === 'departure_way' || route === 'both') {
                const depPrice =
                    addonPrice.food_service_addon[food_type.departure_way] || 0;
                newAmount += depPrice;
            }
            if ((route === 'arrival_way' || route === 'both') && round_trip) {
                const arrPrice =
                    addonPrice.food_service_addon[food_type.arrival_way] || 0;
                newAmount += arrPrice;
            }
            // 🔷 Check if it already exists
            const idx = flight.food_service_addon.findIndex(
                existing =>
                    existing.name === name &&
                    existing.route === route
            );

            if (idx !== -1) {
                // ✨ If exists, deduct previous amount first
                const existing = flight.food_service_addon[idx];

                let prevAmount = 0;

                if (existing.food_type?.departure_way) {
                    prevAmount += addonPrice.food_service_addon[existing.food_type.departure_way] || 0;
                }

                if (round_trip && existing.food_type?.arrival_way) {
                    prevAmount += addonPrice.food_service_addon[existing.food_type.arrival_way] || 0;
                }

                payment_addons.food_service_addon_amount -= prevAmount;

            } 
            // Add the new amount
            payment_addons.food_service_addon_amount += newAmount;
        }
    }
    //
    // 🟢 TRANSPORT FACILITY (Optional — placeholder)
    //
    if (transport_facility) {
        payment_addons.transport_facility_amount = addonPrice.transport_facility * flight.passengerDetails.length
    }
    const orderId = `ORDER_${Date.now()}`;
    let amount = payment_addons.party_addon_amount + payment_addons.food_service_addon_amount + payment_addons.transport_facility_amount
    const payload = {
        order_id: orderId,
        order_amount: Number(amount.toFixed(2)),
        order_currency: 'INR',
        customer_details: {
            customer_id: String(flight.user_id._id),
            customer_email: flight.user_id.email,
            customer_phone: flight.user_id.phone
        },
        order_meta: {
            return_url: `http://localhost:3000/flight/payment-status?order_id=${orderId}`
        }
    };
    console.log(payload)
    const response = await axios.post(
        'https://sandbox.cashfree.com/pg/orders',
        payload,
        {
            headers: {
                'x-client-id': APP_ID,
                'x-client-secret': SECRET_KEY,
                'x-api-version': '2022-09-01',
                'Content-Type': 'application/json'
            }
        }
    );
    let sessionId = response.data.payment_session_id;
    return res.json({ order_id: orderId, session_id: sessionId });
});
const updation_after_payment = asynchandler(async (req, res) => {
  const { payment_id, flight_id } = req.params;
  const { party_addon, transport_facility, food_service_addon } = req.body;

  const paymentDoc = await Payment_Model.findById(payment_id);
  const flight = await FlightModel.findById(flight_id);
  if (!paymentDoc || !flight) {
    throw new ApiError(404, "Payment or Flight not found");
  }

  if (paymentDoc.order_status !== "PAID") {
    return res.json(new ApiResponse(400, false, "Payment not completed", paymentDoc));
  }

  const round_trip = flight.is_round_trip;

  await Payment_Model.findByIdAndUpdate(payment_id, {
    $set: { flight_id }
  }, { new: true, runValidators: true });

  //
  // ✅ Update Party Addon
  //
  if (party_addon) {
    flight.party_addon = {
      event_name: party_addon.event_name,
      route: round_trip ? party_addon.route : "departure_way"
    };
  }

  //
  // ✅ Update Transport Facility
  //
  if (transport_facility) {
    flight.transport_facility = true;
  }

  //
  // ✅ Update Food Service Addons
  //
  if (food_service_addon && Array.isArray(food_service_addon)) {
    for (const addon of food_service_addon) {
      const { name, route, food_type } = addon;

      if (!name || !route || !food_type) {
        throw new ApiError(400, "Invalid food_service_addon structure.");
      }

      if (!round_trip && route !== "departure_way") {
        throw new ApiError(400, "Arrival_way or both not allowed for one-way trip.");
      }

      const idx = flight.food_service_addon.findIndex(
        existing => existing.name === name && existing.route === route
      );

      if (idx !== -1) {
        // Update existing
        flight.food_service_addon[idx] = {
          ...flight.food_service_addon[idx].toObject?.() ?? flight.food_service_addon[idx],
          name,
          route: round_trip ? route : "departure_way",
          food_type,
        };
      } else {
        // Add new
        flight.food_service_addon.push({
          name,
          route: round_trip ? route : "departure_way",
          food_type,
        });
      }
    }
  }

  //
  // ✅ Link payment record to flight
  //
  flight.other_add_ons_details.push(payment_id);
  await flight.save();
  return res.json(
    new ApiResponse(200, true, "Flight addons updated successfully", { payment: paymentDoc, flight })
  );
});

const delete_flight = asynchandler(async (req, res) => {
    const { id } = req.params;

    const flight = await FlightModel.findByIdAndDelete(id);
    if (!flight) throw new ApiError(404, "Flight not found");

    return res
        .status(200)
        .json(new ApiResponse(200, true, "Flight deleted successfully", flight));
});
const get_all_flight_by_operator = asynchandler(async (req, res) => {
    const { id } = req.params
    if (!id) {
        return res.status(400).json(new ApiResponse(400, false, "Operator id is required"))
    }
    const data = await FlightModel.aggregate([
        {
            $lookup: {
                from: "quote_models",
                localField: "quote_id",
                foreignField: "_id",
                as: "check"
            }
        },
        { $unwind: "$fleet" },
        {
            $lookup: {
                from: "fleets",
                localField: "fleet.fleet_request_id",
                foreignField: "_id",
                as: "com"
            }
        },
        { $unwind: "$com" },
        {
            $match: {
                "com.operatorId": new mongoose.Types.ObjectId(id)
            }
        },
        {
            $addFields: {
                "fleet.deparature_airport_id": { $arrayElemAt: ["$departure_airport", 0] },
                "fleet.destination_airport_id": { $arrayElemAt: ["$destination_airport", 0] }
            }
        },
        {
            $project: {
                departure_airport: 0,
                destination_airport: 0
            }
        }
    ]);
    
    console.log(data);
    return res.status(200).json({ message: "successfully fetched flight booked for operator id", success: true, data: data })
})
export { create_flight_request, get_all_flights, get_flight_user_id, get_flight_quoto_id, get_flight_status, cancel_flight, update_flight_addons,updation_after_payment,delete_flight, get_all_flight_by_operator }