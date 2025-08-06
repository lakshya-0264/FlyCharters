import { asynchandler } from "../../Helpers/asynchandler.js";
import { ApiResponse } from "../../Helpers/apiresponse.js";
import { ApiError } from "../../Helpers/apierror.js";
import { EmptyLegModel } from "../../Models/emptylegModel.js"
import { AirportModel } from "../../Models/AirportModel.js"
import { FleetModel } from '../../Models/fleetModel.js'
import { FlightModel } from "../../Models/flightsModel.js";
import { NotificationModel } from "../../Models/NotificationModel.js";
import { Empty_leg_Obj } from "../../Helpers/empty_leg.js";
import { convertToHourMinuteFormat } from "../../Helpers/time_conversion.js";
import ejs from "ejs"
import puppeteer from 'puppeteer';
import path from "path"
import { fileURLToPath } from "url";
import mongoose from "mongoose";
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const logoPath = `file://${path.join(__dirname, '../../Helpers/Screenshot 2025-07-12 185041.png')}`
import { EmptyLegBookingModel } from "../../Models/emptylegbookingModel.js";
const suggest_empty_leg = asynchandler(async (req, res) => {
  const { flight_id } = req.params
  if (!flight_id) {
    return new ApiError(400, "flight_id is required")
  }
  const flight_details = await FlightModel.findById(flight_id).populate([{
    path: "quote_id",
    populate: {
      path: "fleet_request_id"
    }
  }])
  //console.log(flight_details)
  const base_location = flight_details.quote_id.fleet_request_id.aircraftBase
  const deparature_airport_id = flight_details.quote_id.deparature_airport_id
  const destination_airport_id = flight_details.quote_id.destination_airport_id
  const leg_time_array = flight_details.quote_id.leg_time
  const leg_distance_array = flight_details.quote_id.leg_distance
  const [hh, mm] = flight_details.quote_id.departureTime.split(":").map(Number);
  const hours = hh + (mm / 60);
  const populateLeg = async (obj) => {
    const doc = new EmptyLegModel(obj);
    await doc.populate("takeOff_Airport");
    await doc.populate("destination_Airport");
    return doc;
  };
  if (base_location.toString() !== destination_airport_id.toString()) {
    if (base_location.toString() == deparature_airport_id.toString()) {
      const dt = convertToHourMinuteFormat(hours + leg_time_array[0] + 0.5)
      const at = convertToHourMinuteFormat(hours + leg_time_array[0] + 0.5 + leg_time_array[1])
      const empty_leg_obj = new Empty_leg_Obj(flight_details.quote_id.fleet_request_id._id, destination_airport_id,
        base_location, flight_details.quote_id.departureDate, dt, flight_details.quote_id.departureDate,
        at, 5000, 50000
      )
      const populated = await populateLeg(empty_leg_obj);
      return res.json(new ApiResponse(200, true, "empty leg added successfully", populated))
    }
    else {
      const dt1 = convertToHourMinuteFormat(hours - leg_time_array[0])
      const at1 = convertToHourMinuteFormat(hours - 0.5)
      const empty_leg_obj1 = new Empty_leg_Obj(flight_details.quote_id.fleet_request_id._id, base_location,
        deparature_airport_id, flight_details.quote_id.departureDate, dt1, flight_details.quote_id.departureDate,
        at1, 5000, 50000
      )
      const dt2 = convertToHourMinuteFormat(hours + leg_time_array[0] + leg_time_array[1] + 1)
      const at2 = convertToHourMinuteFormat(hours + leg_time_array[0] + leg_time_array[1] + leg_time_array[2] + 1)
      const empty_leg_obj2 = new Empty_leg_Obj(flight_details.quote_id.fleet_request_id._id, destination_airport_id,
        base_location, flight_details.quote_id.departureDate, dt2, flight_details.quote_id.departureDate,
        at2, 5000, 50000
      )
      const populated1 = await populateLeg(leg1);
      const populated2 = await populateLeg(leg2);
      return res.status(200).json(new ApiResponse(200, true, "empty leg created successfully", { empty_leg_obj1: populated1, empty_leg_obj2: populated2 }));
    }
  }
  else {
    const dt = convertToHourMinuteFormat(hours - leg_time_array[0])
    const at = convertToHourMinuteFormat(hours - 0.5)
    const empty_leg_obj = new Empty_leg_Obj(flight_details.quote_id.fleet_request_id._id, base_location,
      deparature_airport_id, flight_details.quote_id.departureDate, dt, flight_details.quote_id.departureDate,
      at, 5000, 50000
    )
    const populated = await populateLeg(empty_leg_obj);
    return res.status(200).json(new ApiResponse(200, true, "empty leg added successfully", populated));
  }
})
const add_empty_leg = asynchandler(async (req, res) => {
  const { empty_leg_object } = req.body;

  if (!empty_leg_object) {
    return res.status(400).json(new ApiResponse(400, false, "empty leg object is required", {}));
  }

  const existing = await EmptyLegModel.findOne(empty_leg_object);
  if (existing) {
    return res.status(400).json(new ApiResponse(400, false, "empty leg already exists", {}));
  }

  const empty_leg = await EmptyLegModel.create(empty_leg_object);
  if (!empty_leg) {
    return res.status(500).json(new ApiResponse(500, false, "some error in creating the empty leg"));
  }
  const notification = await NotificationModel.create({
      recipient: req.user._id,
      sender: req.user._id,
      title: "New Fleet Added",
      message: `Your empty leg has been added and goes for review.`,
      type: "fleet_added",
    });
  
    const io = req.app.get("io");
    if (io) {
      io.to(`user-${req.user._id}`).emit("new-notification", notification);
    }
  
  return res.status(201).json(new ApiResponse(201, true, "empty leg created successfully", empty_leg));
});

const get_all_empty_leg = asynchandler(async (req, res) => {
  const empty_leg = await EmptyLegModel.find().populate("takeOff_Airport").populate("destination_Airport");
  if (!empty_leg) {
    return res.status(400).json({ message: "unable to fetch empty leg" })
  }
  return res.json(new ApiResponse(200, true, "all the empty leg fetched successfully", empty_leg))
})
const search_empty_leg = asynchandler(async (req, res) => {
  const { departureDate } = req.body
  if (!departureDate) {
    return res.status(400).json({ message: "departure date is required" })
  }
  const empty_leg = await EmptyLegModel.find({ departureDate: departureDate })
  if (!empty_leg) {
    return res.status(400).json({ message: "unable to fetch empty leg" })
  }
  return res.json(new ApiResponse(200, true, "all the empty leg fetched succesfully", empty_leg))
})
const get_all_empty_leg_by_operator = asynchandler(async (req, res) => {
  const all_empty_leg = await EmptyLegModel.aggregate([
    {
      $lookup: {
        from: "fleets",
        localField: "fleet_id",
        foreignField: "_id",
        as: "Fleets"
      }
    },
    {
      $unwind: "$Fleets"
    },
    {
      $match: { "Fleets.operatorId": new mongoose.Types.ObjectId(req.user._id) }
    }
  ])
  console.log(all_empty_leg)
  if (!all_empty_leg) {
    return res.status(400).json({ message: "unable to fetch empty leg", })
  }
  return res.json(new ApiResponse(200, true, "all empty leg fetched successfully", all_empty_leg))
})
const invoice_generation_empty = asynchandler(async (req, res) => {
  const { empty_leg_id } = req.params
  const empty_leg = await EmptyLegBookingModel.findById(empty_leg_id).populate({ path: user_id }).populate({
    path: empty_leg_id
  })
  const fleet_detail = await FleetModel.findById(empty_leg.empty_leg_id.fleet_id)
  const deparature = await AirportModel.findById(empty_leg.empty_leg_id.takeOff_Airport)
  const destination = await AirportModel.findById(empty_leg.empty_leg_id.destination_Airport)
  const invoice = {
    date: Date.now(),
    id: "Q-12345",
    Customer: empty_leg.user_id.firstName + empty_leg.user_id.lastName,
    contact: empty_leg.user_id.email,
    air: fleet_detail.name,
    cost: empty_leg.total_amount,
    date_travel: empty_leg.empty_leg_id.departureDate,
    passengers: empty_leg.passengerDetails.length,
    block_time: empty_leg.empty_leg_id.arrivalTime - empty_leg.empty_leg_id.departureTime,
    grand: empty_leg.total_amount,
    grand_total: (empty_leg.total_amount * 18) / 100 + empty_leg.total_amount, // Grand total + 18% GST,
    depart: deparature.source_IATA,
    destin: destination.source_IATA,
  };
  const templatePath = path.join(__dirname, "../../Helpers/empty_leg_template.ejs")
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
export { add_empty_leg, get_all_empty_leg, search_empty_leg, get_all_empty_leg_by_operator, suggest_empty_leg, invoice_generation_empty }