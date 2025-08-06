import { asynchandler } from "../../Helpers/asynchandler.js";
import { ApiResponse } from "../../Helpers/apiresponse.js";
import { ApiError } from "../../Helpers/apierror.js";
import { uploadfile } from "../../Helpers/cloudinary_utils/cloud_utils.js";
import {EmptyLegBookingModel} from "../../Models/emptylegbookingModel.js"
import {EmptyLegModel} from "../../Models/emptylegModel.js"

const add_empty_booking = asynchandler(async (req, res) => {
  const { empty_leg_id } = req.params;
  if (!empty_leg_id) return res.status(400).json({ message: "Flight ID is missing" });

  const flight = await EmptyLegModel.findById(empty_leg_id);
  if (!flight) return res.status(404).json({ message: "Flight not found" });
  if (["booked", "cancelled"].includes(flight.status))
    return res.status(400).json({ message: `Flight is already ${flight.status}` });

  const seats_booked = parseInt(req.body.seats_booked);
  if (!seats_booked || seats_booked <= 0)
    return res.status(400).json({ message: "Invalid number of seats" });
  if (seats_booked > flight.availableSeats)
    return res.status(400).json({ message: "Seats booked exceed available seats" });

  let passengerDetails;
  try {
    passengerDetails = JSON.parse(req.body.passengerDetails);
    if (!Array.isArray(passengerDetails)) throw new Error();
  } catch {
    return res.status(400).json({ message: "Invalid passenger details" });
  }

  let corporateDetails = {};
  try {
    corporateDetails = { isCorporate: false, ...JSON.parse(req.body.corporateDetails || "{}") };
    if (corporateDetails.isCorporate) {
      const { companyName, companyId } = corporateDetails;
      if (!companyName || !companyId) {
        return res.status(400).json({ message: "Company Name and GST/ID are required for corporate bookings." });
      }
    }
  } catch {
    corporateDetails = {};
  }

  let petDetailsToStore;
  try {
    let vaccinationCertificateUrl = "";
    const vaccinationCertificateFile = req.files?.vaccinationCertificate?.[0];
    if (vaccinationCertificateFile) {
      const uploaded = await uploadfile(vaccinationCertificateFile.path);
      vaccinationCertificateUrl = uploaded.secure_url;
    }


    const petDetails = JSON.parse(req.body.petDetails);
    if (petDetails?.isPet) {
      const {
        type, specify, weight,
        sitToTravelCertificate,
        agreePetPolicy
      } = petDetails;

      if (!type) return res.status(400).json({ message: "Pet type is required" });
      if (type === "Other" && !specify?.trim()) {
        return res.status(400).json({ message: "Please specify the pet type" });
      }
      if (!weight || parseFloat(weight) <= 0) {
        return res.status(400).json({ message: "Pet weight must be provided" });
      }
      if (!vaccinationCertificateUrl) {
        return res.status(400).json({ message: "Vaccination certificate is required" });
      }
      if (!sitToTravelCertificate) {
        return res.status(400).json({ message: "Fit-to-travel certificate is required" });
      }
      if (!agreePetPolicy) {
        return res.status(400).json({ message: "Please accept the pet travel policy" });
      }

      // const certDate = new Date(sitToTravelCertificateDate);
      // const flightDepartureDate = new Date(flight.departureDate);
      // const hoursDiff = (flightDepartureDate - certDate) / (1000 * 60 * 60);
      // if (hoursDiff > 48) {
      //   return res.status(400).json({
      //     message: "Sit-to-travel certificate must be issued within 48 hours before departure"
      //   });
      // }

      petDetailsToStore = {
        isPet: true,
        type,
        specify: type === "Other" ? specify : "",
        weight,
        vaccinationCertificate: vaccinationCertificateUrl,
        sitToTravelCertificate,
        agreePetPolicy
      };
    } else {
      petDetailsToStore = { isPet: false };
    }
  } catch {
    petDetailsToStore = undefined;
  }

  const book_ticket = await EmptyLegBookingModel.create({
    user_id: req.user._id,
    empty_leg_id,
    full_plane_booked: false,
    total_amount: flight.priceperseat * seats_booked,
    seats_booked,
    passengerDetails: passengerDetails.map(p => ({
      name: p.name,
      nationality: p.nationality,
      ...(p.email && { email: p.email }),
      ...(p.phone && { phone: p.phone }),
      ...(p.passport && { passport: p.passport }),
      ...(p.gender && { gender: p.gender })
    })),
    petDetails: petDetailsToStore,
    corporateDetails
  });

  return res.json(new ApiResponse(200, true, "Booking successful", book_ticket));
});

const getBookingById = asynchandler(async (req, res) => {
    const { bookingId } = req.params;

    const booking = await EmptyLegBookingModel.findById(bookingId)
        .populate({
            path: "empty_leg_id",
            populate: ["takeOff_Airport", "destination_Airport"]
        })
        .populate("user_id");

    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    return res.status(200).json(new ApiResponse(200, true, "Booking fetched successfully", booking));
});

const getAllEmptyLegBookings = asynchandler(async (req, res) => {
  const userId = req.user._id;

  const bookings = await EmptyLegBookingModel.find({ user_id: userId })
    .populate({
      path: "empty_leg_id",
      populate: [
        { path: "takeOff_Airport" },
        { path: "destination_Airport" },
        { path:"fleet_id" }
      ]
    })
    .sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, true, "User bookings fetched", bookings));
});

const confirmBookingStatus = asynchandler(async (req, res) => {
  console.log("Confirm API hit with ID:", req.params.id); // ✅ debug
  const bookingId = req.params.id;

  const booking = await EmptyLegBookingModel.findByIdAndUpdate(
    bookingId,
    { booking_status: "confirmed" },
    { new: true }
  );

  if (!booking) return res.status(404).json({ message: "Booking not found" });

  res.json(new ApiResponse(200, true, "Booking confirmed", booking));
});


const getBookingbyFilter=asynchandler(async(req,res)=>{
    const {booking_status,payment_status}=req.query
    const filter={}
    if(booking_status)filter.booking_status=booking_status
    if(payment_status)filter.payment_status=payment_status
    const bookings=await EmptyLegBookingModel.find(filter)
    if(!bookings){
        return res.status(200).json({message:"error in fetching query"})
    }
    return res.status(200).json(new ApiResponse(200,true,"all the result based on filter",bookings))
})

const after_payment_booking = asynchandler(async (req, res) => {
    const { emptyleg_id } = req.params
    if (!emptyleg_id) {
        return res.json({ status: 400, message: "bookticket_id is missing" })
    }
    const booking = await EmptyLegBookingModel.findById(emptyleg_id)
    if (!booking) {
        return res.json({ status: 404, message: "booking not found" })
    }
    // if (["confirmed", "confirmed"].includes(booking.booking_status)) {
    //     return res.json({ status: 400, message: `booking is already ${booking.booking_status}` })
    // }
    const EmptyLeg = await EmptyLegModel.findById(booking.empty_leg_id)
    if (!EmptyLeg) {
        return res.json({ status: 404, message: "empty leg not found" })
    }
    if (booking.full_plane_booked == true) {
        const update_flight = EmptyLeg.findByIdAndUpdate(booking.empty_leg_id, {
            availableSeats: 0,
            status: "booked"
        }, { new: true, runValidators: true })
        if (!update_flight) {
            return res.json({ status: 404, message: "empty leg  not found" })
        }
    }
    else {
        const update_available_seat =  - booking.seats_booked
        const update_flight = await EmptyLegModel.findByIdAndUpdate(booking.empty_leg_id, {
            $set: {
                no_seats:update_available_seat,
                status: update_available_seat == 0 ? "booked" : "available"
            }
        }, { new: true, runValidators: true })
        if (!update_flight) {
            return res.json({ status: 404, message: "flight not found" })
        }
    }
    const final_booking_ticket = await EmptyLegBookingModel.findByIdAndUpdate(emptyleg_id, {
        $set: {
            booking_status:"confirmed",
            payment_status:"paid"

        }
    }, { new: true, runValidators: true })
    if (!final_booking_ticket) {
        return res.json({ status: 400, message: "booking failed" })
    }
    return res.json(new ApiResponse(200, true, "booking is confirmed", final_booking_ticket))
})

const cancellation_empty_leg = asynchandler(async (req, res) => {
    const { empty_leg_id } = req.params
    if (!empty_leg_id) {
        return res.json({ status: 400, message: "empty_leg_id is missing" })
    }
    const empty_leg_booking = await EmptyLegBookingModel.findById(empty_leg_id)
    if (!empty_leg_booking) {
        return res.json({ status: 404, message: "empty leg booking not found" })
    }
    if (empty_leg_booking.booking_status == "cancelled") {
        return res.json({ status: 400, message: `booking is already ${booking.booking_status}` })
    }
    const empty_leg = await EmptyLegModel.findById(empty_leg_booking.empty_leg_id)
    if (!empty_leg) {
        return res.json({ status: 404, message: "empty leg not found" })
    }
    if (empty_leg_booking.is_full_plane == true) {
        const updateavailable_seats = empty_leg_booking.seats_booked;
        const update_empty_leg = await EmptyLegModel.findByIdAndUpdate(empty_leg_booking.empty_leg_id, {
            $set: {
                no_seat: updateavailable_seats,
                status: "available"
            }
        }, { new: true, runValidators: true })
        if (!update_empty_leg) {
            return res.json({ status: 404, message: "empty leg not found" })
        }
    }
    else {
        const updateavailable_seats = empty_leg.no_seat + empty_leg_booking.seats_booked;
        const update_empty_leg = await EmptyLegModel.findByIdAndUpdate(empty_leg_booking.empty_leg_id,{
            $set:{
                no_seat:updateavailable_seats,
                status:"available"
            }
        },{new:true,runValidators:true})
        if(!update_empty_leg){
            return res.json({ status: 404, message: "empty leg not found" })
        }
    }
    const update_empty_booking_ticket = await EmptyLegBookingModel.findByIdAndUpdate(empty_leg_id, {
        $set: {
            booking_status: "cancelled",
            is_payment_refund: true
        }
    })
    if (!update_empty_booking_ticket) {
        return res.json({ status: 400, message: "booking failed" })
    }
    return res.json(new ApiResponse(200, true, "empty leg is cancelled successfully", update_empty_booking_ticket))
})
export {add_empty_booking,getAllEmptyLegBookings,getBookingById,getBookingbyFilter, confirmBookingStatus,after_payment_booking,cancellation_empty_leg}