import { asynchandler } from "../../Helpers/asynchandler.js";
import { ApiResponse } from "../../Helpers/apiresponse.js";
import { addfleetschemavalidation } from "../../Helpers/validation_schemas/fleet_validation.js";
import { FleetModel } from "../../Models/fleetModel.js";
import {
  uploadfile,
  deletefile,
} from "../../Helpers/cloudinary_utils/cloud_utils.js";
import User from "../../Models/userModel.js";
import { ApiError } from "../../Helpers/apierror.js";
import { Operator_Model } from "../../Models/operatorModel.js";
import { FlightModel } from "../../Models/flightsModel.js";
import { cost_calculator } from "../quote_controller/quote_controller.js";
import { FleetCompleteDetails } from "../../Helpers/fleetfordate.js";
import { generate_quote_flight } from "../quote_controller/quote_controller.js";
import { gst } from "../../Helpers/other_info.js";
import { AirportModel } from "../../Models/AirportModel.js";
import { NotificationModel } from "../../Models/NotificationModel.js";
import { cost_calculator_round_trip } from "../quote_controller/quote_controller.js";
import ejs from "ejs"
import puppeteer from 'puppeteer';
import path from "path"
import { fileURLToPath } from "url";
// import { Quote_Model } from "../../Models/QuotesModel.js";
// import { Payment_Model } from "../../Models/paymentModel.js";
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const logoPath = `file://${path.join(__dirname, '../../Helpers/Screenshot 2025-07-12 185041.png')}`
const FOOD_COSTS = {
  snacks: 5000,
  lunch: 10000,
  buffet: 120000
};
const getFleetbyId = asynchandler(async (req, res) => {
  const { fleetId } = req.params;
  const fleet = await FleetModel.findById(fleetId).populate("");
  if (!fleet) {
    throw new ApiError(404, "Fleet not found");
  }
  return res.json(
    new ApiResponse(200, true, "fleet fetched successfully", fleet)
  );
});

const getAllFleets = asynchandler(async (req, res) => {
  const fleets = await FleetModel.find().populate("operatorId");
  return res.json(new ApiResponse(200, true, "all the fleet fetched", fleets));
});

const getFleetsByOperator = asynchandler(async (req, res) => {
  const { operator_id } = req.params;
  if (!operator_id) {
    throw new ApiError(400, "Operator_id not found");
  }
  const fleets = await FleetModel.find({ operatorId: operator_id });
  if (!fleets) {
    throw new ApiError(404, "No fleets found for this operator");
  }
  return res.json(new ApiResponse(200, true, "all fleets by operator", fleets));
});

const Add_Fleet_Controller = asynchandler(async (req, res) => {
  const {
    name, capacity, model, description, eom, validityTill, status,
    aircraftRegn, auw, cruisingSpeed, cruisingLevel, aircraftBase,
    price_per_hour, priceperseat, full_plane_price,
    isAbleToLandUncontrolled, isPerformanceLimited, isAbleToLandShortRunway,
    petFriendly
  } = req.body;

  // Validate required fields
  if (
    !name || !capacity || !model || !description || !eom || !validityTill ||
    !status || !aircraftRegn || !auw || !cruisingSpeed || !cruisingLevel ||
    !aircraftBase || !price_per_hour || !priceperseat || !full_plane_price
  ) {
    throw new ApiError(400, "Please fill all the fields");
  }

  if (
    isAbleToLandUncontrolled === null || isPerformanceLimited === null || isAbleToLandShortRunway === null || petFriendly === null
  ) {
    throw new ApiError(400, "Please answer all Yes/No questions");
  }

  // Parallel DB checks
  const [user, operator] = await Promise.all([
    User.findById(req.user._id),
    Operator_Model.findOne({ operatorid: req.user._id, verified_documents: true })
  ]);

  if (!user) throw new ApiError(404, "User not found");
  if (!operator) throw new ApiError(400, "Operator not found or not verified");

  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, "At least one fleet image is required");
  }

  // Parallel file uploads
  let uploadedImages;
  try {
    const uploadPromises = req.files.map((file) => uploadfile(file.path));
    console.log(uploadPromises);
    uploadedImages = await Promise.all(uploadPromises);
  } catch (error) {
    throw new ApiError(400, "Error uploading fleet image");
  }

  const imageUrls = uploadedImages.map((img) => img.url);

  // Insert fleet into DB
  const fleetData = {
    operatorId: req.user._id,
    name, capacity, model, description, validityTill, eom, status,
    aircraftRegn, auw, cruisingSpeed, cruisingLevel, aircraftBase,
    price_per_hour, fleetInnerImages: imageUrls,price_per_seat: priceperseat,full_plane_price,
    isAbleToLandUncontrolled, isPerformanceLimited, isAbleToLandShortRunway, petFriendly,
  };


  const newFleet = await FleetModel.create(fleetData);

  // Notification + Emit socket event — don't await socket emit
  const notification = await NotificationModel.create({
    recipient: req.user._id,
    sender: req.user._id,
    title: "New Fleet Added",
    message: `Your fleet ${name} has been added and goes for review.`,
    type: "fleet_added",
  });

  const io = req.app.get("io");
  if (io) {
    io.to(`user-${req.user._id}`).emit("new-notification", notification);
  }

  return res.json(
    new ApiResponse(200, true, "Fleet has been created", newFleet)
  );
});

const Delete_Fleet_Controller = asynchandler(async (req, res) => {
  const { fleetId } = req.params;
  const fleet = await FleetModel.findById(fleetId);
  if (!fleet) {
    throw new ApiError(404, "Fleet not found");
  }
  await FleetModel.findOneAndDelete({ _id: fleetId, operatorId: req.user._id });
  return res.json(new ApiResponse(200, true, "fleet has been deleted"));
});

const Update_Fleet_Controller = asynchandler(async (req, res) => {
  const { fleetId } = req.params;
  const updates = { ...req.body };
  const existing = JSON.parse(req.body.existingImages || "[]");

  if (!existing || existing.length + (req.files?.length || 0) < 3) {
    throw new ApiError(
      400,
      "images requried"
    );
  }

  // Upload new images
  const newUploads = req.files?.length
    ? await Promise.all(
        req.files.map((file) => uploadfile(file.path).then((r) => r.url))
      )
    : [];

  updates.fleetInnerImages = [...existing, ...newUploads];

  const fleet = await FleetModel.findByIdAndUpdate(
    fleetId,
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (!fleet) {
    throw new ApiError(500, "Some error while updating fields");
  }

  res.status(200).json({ success: true, data: fleet });
});
const invoice_generation = asynchandler(async (req, res) => {
  // const { flight_id,payment_id } = req.params
  // if (!flight_id) {
  //   return res.status(400).json({ message: "flight id is required" })
  // }
  // const flight_details = await FlightModel.findById(flight_id).populate({
  //   path: "quote_id",
  //   populate: [
  //     {
  //       path: "fleet_request_id",
  //     },
  //     {
  //       path: "deparature_airport_id"
  //     },
  //     {
  //       path: "destination_airport_id"
  //     },
  //   ]
  // }).populate({ path: "user_id" });
  // console.log(flight_details)
  // const base_airport = await AirportModel.findById(flight_details.quote_id.fleet_request_id.aircraftBase)
  // console.log(base_airport)
  // let type = "One-Way"
  // if (flight_details?.is_round_trip == true) {
  //   type = "Round-trip"
  // }
  // let is_cop = flight_details.corporateDetails.isCorporate
  // // Total Cost calculation
  // let party_addon_cost = 0
  // if (flight_details.party_addon != undefined) {
  //   if (flight_details.party_addon.event_name == "Birthday") {
  //     if (flight_details.party_addon.route != "both") {
  //       party_addon_cost = 50000
  //     }
  //     else {
  //       party_addon_cost = 50000 * 2
  //     }
  //   }
  //   else {
  //     if (flight_details.party_addon.route != "both") {
  //       party_addon_cost = 60000
  //     }
  //     else {
  //       party_addon_cost = 60000 * 2
  //     }
  //   }
  // }
  // let transportFacility_cost = flight_details.transport_facility ? flight_details.passengerDetails.length * 1000 : 0
  // let food_service_cost = 0
  // for (const addon of food_service_details) {
  //   // Round-trip
  //   if (is_round_trip) {
  //     if (addon.departure_way && FOOD_COSTS[addon.departure_way]) {
  //       food_service_cost += FOOD_COSTS[addon.departure_way];
  //     }
  //     if (addon.arrival_way && FOOD_COSTS[addon.arrival_way]) {
  //       food_service_cost += FOOD_COSTS[addon.arrival_way];
  //     }
  //   } else {
  //     // One-way only uses departure_way
  //     if (addon.departure_way && FOOD_COSTS[addon.departure_way]) {
  //       food_service_cost += FOOD_COSTS[addon.departure_way];
  //     }
  //   }
  // }

  // let pet_cost = 0
  // let total_cost = flight_details.quote_id.total_cost + party_addon_cost + transportFacility_cost + food_service_cost + pet_cost
  // const payment=Payment_Model.findById(payment_id)
  // const invoice_main = {
  //   pnr: flight_details.pnr,
  //   date: Date.now(),
  //   customerName: flight_details.user_id.firstName + flight_details.user_id.lastName,
  //   customerContact: flight_details.user_id.phone,

  //   aircraft: flight_details.quote_id.fleet_request_id.name,
  //   baseAirport: base_airport.source_IATA,
  //   dateOfTravel: flight_details.quote_id.departureDate,
  //   blockTime: flight_details.quote_id.departureDate,
  //   flightType: type,
  //   passengers: flight_details.passengerDetails.length,
  //   costPerHour: 50000,
  //   departureCity: flight_details.quote_id.deparature_airport_id.source_IATA,
  //   destinationCity: flight_details.quote_id.destination_airport_id.source_IATA,

  //   ...(is_cop && {
  //     corporateDetails: {
  //       companyName: flight_details.corporateDetails.companyName,
  //     },
  //   }),

  //   addons: {
  //     foodServices: { description: 'Gourmet In-flight Dining (Custom Menu)', amount: '₹' + food_service_cost },
  //     transportFacility: { description: 'Chauffeur Service (Airport to Destination)', amount: '₹' + transportFacility_cost },
  //     partyAddons: { description: 'In-flight Celebration Package (Decor & Cake)', amount: '₹' + party_addon_cost },
  //     petAddons: { description: 'Pet Travel Comfort Kit & Special Handling', amount: '₹' + pet_cost },
  //     // To hide a specific add-on, set it to null:
  //     // foodServices: null,
  //   },
  //   handlingFeesItem: {
  //     description: 'Handling Fees',
  //     rate: flight_details.handling_fee,
  //     total: flight_details.handling_fee
  //   },
  //   crewCharges: {
  //     pilotFee: { description: 'Pilot Fee for Flight', amount: '₹15,000.00' },
  //     airHostessFee: { description: 'Air Hostess Fee (2 Crew)', amount: '₹8,000.00' },
  //     otherCrewCharges: { description: 'Ground Crew Support', amount: '₹3,000.00' },
  //     // To hide a specific crew charge, set it to null:
  //     // pilotFee: null,
  //   },
  //   subtotal: total_cost, // Example calculation: 18450 + 60000 (hourly+handling) + 25000 + 10000 + 30000 + 5000 (addons) + 15000 + 8000 + 3000 (crew)
  //   gstAmount: (total_cost * gst) / 100, // 18% of subtotal
  //   grandTotal: total_cost + (total_cost * gst) / 100,
  //   curr:payment.order_currency,
  //   pay_method:payment.order_meta.payment_methods
  // }
  const invoice = {
    pnr: 'FC-INV-2025-001',
    date: 'July 19, 2025',
    customerName: 'Global Corp. Aviation Division',
    customerContact: 'John Doe (john.doe@globalcorp.com)',
    customerAddress: '789 Corporate Tower, Business District, City, State, 12345',
    customerGST: 'GSTIN1234567890ABC',

    aircraft: 'Gulfstream G650',
    baseAirport: 'DEL',
    costPerHour: '₹45,000.00',
    dateOfTravel: 'August 10, 2025',
    passengers: 8,
    blockTime: '0.41 Hrs',
    departureCity: 'Delhi',
    destinationCity: 'Mumbai',
    flightType: 'One-Way',

    hourlyCostItem: {
      description: 'Aircraft Hourly Cost',
      blockTime: '0.41',
      rate: '₹45,000.00',
      total: '₹18,450.00'
    },
    handlingFeesItem: {
      description: 'Handling Fees',
      rate: '₹60,000.00',
      total: '₹60,000.00'
    },
    additionalItems: [
      // You can add more items here if needed
      // {
      //     description: 'Luxury Lounge Access',
      //     blockTime: '',
      //     rate: '₹10,000.00',
      //     total: '₹10,000.00'
      // }
    ],

    // Corporate Details (Optional - set to null or omit if not applicable to hide the section)
    corporateDetails: {
      companyName: 'Client Corporate Solutions Ltd.',
      address: '456 Corporate Blvd, Metropolis, State, 10001, Country',
      contactPerson: 'Jane Smith (Head of Travel)',
      contactEmail: 'jane.smith@clientcorp.com',
      contactPhone: '+1 (555) 987-6543'
    },
    // To hide corporate details, you can set it to null:
    // corporateDetails: null,

    // Add-on Services (Optional - set individual add-ons to null or omit if not applicable)
    addons: {
      foodServices: { description: 'Gourmet In-flight Dining (Custom Menu)', amount: '₹25,000.00' },
      transportFacility: { description: 'Chauffeur Service (Airport to Destination)', amount: '₹10,000.00' },
      partyAddons: { description: 'In-flight Celebration Package (Decor & Cake)', amount: '₹30,000.00' },
      petAddons: { description: 'Pet Travel Comfort Kit & Special Handling', amount: '₹5,000.00' },
      // To hide a specific add-on, set it to null:
      // foodServices: null,
    },
    // To hide the entire add-ons section, set addons to null:
    // addons: null,

    // Crew Charges (Optional - set individual crew charges to null or omit if not applicable)
    crewCharges: {
      pilotFee: { description: 'Pilot Fee for Flight', amount: '₹15,000.00' },
      airHostessFee: { description: 'Air Hostess Fee (2 Crew)', amount: '₹8,000.00' },
      otherCrewCharges: { description: 'Ground Crew Support', amount: '₹3,000.00' },
      // To hide a specific crew charge, set it to null:
      // pilotFee: null,
    },
    // To hide the entire crew charges section, set crewCharges to null:
    // crewCharges: null,

    // Calculated totals (ensure these are correctly calculated in your backend logic)
    subtotal: '₹159,450.00', // Example calculation: 18450 + 60000 (hourly+handling) + 25000 + 10000 + 30000 + 5000 (addons) + 15000 + 8000 + 3000 (crew)
    gstAmount: '₹28,701.00', // 18% of subtotal
    grandTotal: '₹188,151.00', // subtotal + gstAmount
    curr:'INR',
    pay_method:'NET Banking'

  };

  const templatePath = path.join(__dirname, "../../Helpers/invoice_template.ejs")
  const html = await ejs.renderFile(templatePath, { invoice })
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setContent(html, { waitUntil: 'domcontentloaded' });
  const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
  await browser.close();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
  res.send(pdfBuffer);
})
const getAvailableFleetsForDate = asynchandler(async (req, res) => {
  const { departureDate, departureAirportId, destinationAirportId, departureTime, is_round_trip, stay_time_hour } = req.body;
  
  if (!departureDate) {
    return res.status(400).json({ message: "departureDate is required" });
  }
  
  if (!departureAirportId || !destinationAirportId || !departureTime || (is_round_trip === undefined || is_round_trip === null)) {
    return res.status(400).json({ message: "departureAirportId and destinationAirportId are missing" })
  }
  const departureAirport_details = await AirportModel.findById(
    departureAirportId
  );
  const destinationAirport_details = await AirportModel.findById(
    destinationAirportId
  );
  if (!departureAirport_details || !destinationAirport_details) {
    return res.status(400).json({ message: "airport are not available" });
  }
  const deparcond_controlled =
    departureAirport_details.classification === "Controlled" ? true : false;
  const destancond_controlled =
    destinationAirport_details.classification === "Controlled" ? true : false;
  const date = new Date(departureDate);
  const nextDate = new Date(date);
  nextDate.setDate(date.getDate() + 1);
  
  const availableSeats = await FleetModel.aggregate([
    {
      $lookup: {
        from: "Quote_Model",
        localField: "_id",
        foreignField: "fleet_request_id",
        as: "matchedFlights",
      },
    },
    {
      $addFields: {
        flightsOnDate: {
          $filter: {
            input: "$matchedFlights",
            as: "flight",
            cond: {
              $and: [
                { $gte: ["$$flight.departureDate", date] },
                { $eq: ["$$flight.isAdminVerify", true] },
                { $eq: ["$$flight.isAbleToLandcontrolled", deparcond_controlled] },
                { $eq: ["$$flight.isAbleToLandcontrolled", destancond_controlled] }
              ],
            },
          },
        },
      },
    },
    {
      $match: {
        $and: [
          { flightsOnDate: { $eq: [] } },
          {
            $or: [
              { booked_dates: { $eq: [] } },
              {
                booked_dates: {
                  $not: {
                    $elemMatch: {
                      date: { $gte: date }
                    }
                  }
                }
              }
            ]
          }
        ]
      }
    },
    {
      $project: {
        matchedFlights: 0,
        flightsOnDate: 0
      }
    }
  ])
  console.log(availableSeats)
  if (is_round_trip == true) {
    if (!stay_time_hour) {
      return res.status(400).json({ message: "stay time is required" })
    }
    
    const result = []
    for (let i = 0; i < availableSeats.length; i++) {
      const res = await cost_calculator_round_trip(availableSeats[i].aircraftBase, departureAirportId, destinationAirportId, availableSeats[i].cruisingSpeed, availableSeats[i].price_per_hour, stay_time_hour, 50000);
      if (!res) {
        continue
      }
      const cost_with_gst = (res.total_cost * gst / 100) + res.total_cost
      const resobj = new FleetCompleteDetails(availableSeats[i], res.total_cost, res.total_time, res.total_distance, res.leg_distances, res.leg_times, cost_with_gst);
      result.push({ fleet_details: availableSeats[i], quoto_detail: resobj })
    }
    
    return res.status(200).json({ message: "all the flights round trip way fetched", success: true, data: result })
  } else {
    const result = [];
    for (let i = 0; i < availableSeats.length; i++) {
      const res = await cost_calculator(availableSeats[i].aircraftBase, departureAirportId, destinationAirportId, availableSeats[i].cruisingSpeed, availableSeats[i].price_per_hour);
      if (!res) {
        continue
      }
      const cost_with_gst = (res.total_cost * gst / 100) + res.total_cost
      const resobj = new FleetCompleteDetails(availableSeats[i], res.total_cost, res.total_time, res.total_distance, res.leg_distances, res.leg_times, cost_with_gst);
      result.push({ fleet_details: availableSeats[i], quoto_detail: resobj })
    }
    return res.status(200).json({ message: "all the flights one way fetched", success: true, data: result })
  }
})
const fleetsRequestingApproval = asynchandler(async (req, res) => {
  try {
    const fleets = await FleetModel.find()
      .populate('operatorId', 'firstName lastName username email') // Changed from 'name' to 'firstName lastName'
      .populate('aircraftBase', 'airport_name code city')
      .sort({ createdAt: -1 });

    const fleetsData = fleets || [];

    return res.status(200).json({
      success: true,
      message: "Fleets fetched successfully",
      data: fleetsData
    });
  } catch (error) {
    console.error('Error fetching fleets for approval:', error);
    return res.status(500).json({
      success: false,
      message: "Error fetching fleets for approval",
      error: error.message
    });
  }
});

// Also fix the ApprovalRejection function to use firstName lastName
const ApprovalRejection = asynchandler(async (req, res) => {
  try {
    const { fleetId } = req.params;
    const { isAdminVerify, status } = req.body;

    // Validate required fields
    if (typeof isAdminVerify !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: "isAdminVerify must be a boolean value"
      });
    }

    // Validate status
    if (status && !['available', 'unavailable', 'unmaintenance'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "status must be either 'available', 'unavailable', or 'unmaintenance'"
      });
    }

    // Find the fleet
    const fleet = await FleetModel.findById(fleetId);
    if (!fleet) {
      return res.status(404).json({
        success: false,
        message: "Fleet not found"
      });
    }

    // Prepare update object
    const updateData = { 
      isAdminVerify: isAdminVerify
    };

    if (status) {
      updateData.status = status;
    } else {
      updateData.status = isAdminVerify ? 'available' : 'unavailable';
    }

    // Update the fleet
    const updatedFleet = await FleetModel.findByIdAndUpdate(
      fleetId,
      updateData,
      { new: true, runValidators: true }
    ).populate('operatorId', 'firstName lastName username email') // Changed here too
     .populate('aircraftBase', 'name code city');

    if (!updatedFleet) {
      return res.status(500).json({
        success: false,
        message: "Failed to update fleet"
      });
    }

    // Create notification for operator (only if operator exists)
    if (fleet.operatorId) {
      const notificationMessage = isAdminVerify 
        ? `Your fleet "${fleet.name}" has been approved and is now available.`
        : `Your fleet "${fleet.name}" has been rejected. Please contact support for more details.`;

      try {
        const notification = await NotificationModel.create({
          recipient: fleet.operatorId,
          sender: req.user?._id || fleet.operatorId,
          title: isAdminVerify ? "Fleet Approved" : "Fleet Rejected",
          message: notificationMessage,
          type: isAdminVerify ? "fleet_approved" : "fleet_rejected",
        });

        // Send socket notification
        const io = req.app.get("io");
        if (io) {
          io.to(`user-${fleet.operatorId}`).emit("new-notification", notification);
        }
      } catch (notificationError) {
        console.error('Error creating notification:', notificationError);
      }
    }

    return res.status(200).json({
      success: true,
      message: `Fleet ${isAdminVerify ? 'approved' : 'rejected'} successfully`,
      data: updatedFleet
    });
  } catch (error) {
    console.error('Error in approval/rejection:', error);
    return res.status(500).json({
      success: false,
      message: "Error updating fleet status",
      error: error.message
    });
  }
});
const getFleetStats = asynchandler(async (req, res) => {
  try {
    const stats = await FleetModel.aggregate([
      {
        $group: {
          _id: null,
          totalFleets: { $sum: 1 },
          pendingApproval: {
            $sum: { $cond: [{ $eq: ["$isAdminVerify", false] }, 1, 0] }
          },
          approvedFleets: {
            $sum: { $cond: [{ $eq: ["$isAdminVerify", true] }, 1, 0] }
          },
          availableFleets: {
            $sum: { $cond: [{ $eq: ["$status", "available"] }, 1, 0] }
          },
          unavailableFleets: {
            $sum: { $cond: [{ $eq: ["$status", "unavailable"] }, 1, 0] }
          },
          maintenanceFleets: {
            $sum: { $cond: [{ $eq: ["$status", "unmaintenance"] }, 1, 0] }
          }
        }
      }
    ]);

    const result = stats[0] || {
      totalFleets: 0,
      pendingApproval: 0,
      approvedFleets: 0,
      availableFleets: 0,
      unavailableFleets: 0,
      maintenanceFleets: 0
    };

    return res.status(200).json({
      success: true,
      message: "Fleet statistics fetched successfully",
      data: result
    });
  } catch (error) {
    console.error('Error fetching fleet stats:', error);
    return res.status(500).json({
      success: false,
      message: "Error fetching fleet statistics",
      error: error.message
    });
  }
});

export { 
  getAllFleets, 
  getFleetbyId, 
  getFleetsByOperator, 
  Add_Fleet_Controller, 
  Delete_Fleet_Controller, 
  Update_Fleet_Controller, 
  getAvailableFleetsForDate, 
  invoice_generation,
  fleetsRequestingApproval,
  ApprovalRejection,
  getFleetStats
}