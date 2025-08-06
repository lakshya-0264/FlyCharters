import { asynchandler } from "../../Helpers/asynchandler.js";
import { ApiResponse } from "../../Helpers/apiresponse.js";
import { ApiError } from "../../Helpers/apierror.js";
import { Booking } from "../../Models/bookingModel.js";
import { FlightModel } from "../../Models/flightsModel.js";
const add_booking = asynchandler(async (req, res) => {
    const { flight_id } = req.params;
    if (!flight_id) {
        return res.json({ status: 400, message: "user id or flight id is missing" })
    }
    const { full_plane_booked, seats_booked, passengerDetails } = req.body
    if (typeof full_plane_booked === 'undefined' && typeof seats_booked === 'undefined') {
        return res.status(400).json({ message: "full_plane_booked or seats_booked is missing" });
    }
    const flight = await FlightModel.findById(flight_id)
    if (!flight) {
        return res.json({ status: 404, message: "flight not found" })
    }
    if (["booked", "cancelled"].includes(flight.status)) {
        return res.status(400).json({ message: `flight is already ${flight.status}` })
    }
    if (full_plane_booked === true) {
        const book_ticket = await Booking.create({
            user_id: req.user._id,
            flight_id: flight_id,
            full_plane_booked: true,
            total_amount: flight.fullPlanePrice,
            seats_booked: flight.availableSeats,
            passengerDetails: passengerDetails || []
        })
        if (!book_ticket) {
            return res.json({ status: 400, message: "booking failed" })
        }
        return res.json(new ApiResponse(200, true, "Flight booking is done please proceed with payment", book_ticket))
    }

    else if (seats_booked && seats_booked > 0) {
        const no_seats = flight.availableSeats

        if (!seats_booked || seats_booked <= 0) {
            return res.status(400).json({ message: "Invalid no. of seats" });
        }

        if (seats_booked > no_seats) {
            return res.json({ status: 400, message: "seats booked is more than available seats" })
        }
        const book_ticket = await Booking.create({
            user_id: req.user._id,
            flight_id: flight_id,
            full_plane_booked: false,
            total_amount: flight.pricePerSeat * seats_booked,
            seats_booked: seats_booked,
            passengerDetails: passengerDetails || []
        })

        if (!book_ticket) {
            return res.json({ status: 400, message: "Booking failed" })
        }
        return res.json(new ApiResponse(200, true, "Flight booking is done, please procced with payment", book_ticket))
    }
    return res.status(400).json({ message: "Invalid booking request" });
});

const after_payment_booking = asynchandler(async (req, res) => {
    const { bookticket_id } = req.params
    if (!bookticket_id) {
        return res.json({ status: 400, message: "bookticket_id is missing" })
    }
    const booking = await Booking.findById(bookticket_id)
    if (!booking) {
        return res.json({ status: 404, message: "booking not found" })
    }
    if (["confirmed", "confirmed"].includes(booking.booking_status)) {
        return res.json({ status: 400, message: `booking is already ${booking.booking_status}` })
    }
    const flight = await FlightModel.findById(booking.flight_id)
    if (!flight) {
        return res.json({ status: 404, message: "flight not found" })
    }
    if (booking.full_plane_booked == true) {
        const update_flight = await FlightModel.findByIdAndUpdate(booking.flight_id, {
            availableSeats: 0,
            status: "booked"
        }, { new: true, runValidators: true })
        if (!update_flight) {
            return res.json({ status: 404, message: "flight not found" })
        }
    }
    else {
        const update_available_seat = flight.availableSeats - booking.seats_booked
        const update_flight = await FlightModel.findByIdAndUpdate(booking.flight_id, {
            $set: {
                availableSeats: update_available_seat,
                status: update_available_seat == 0 ? "booked" : "available"
            }
        }, { new: true, runValidators: true })
        if (!update_flight) {
            return res.json({ status: 404, message: "flight not found" })
        }
    }
    const final_booking_ticket = await Booking.findByIdAndUpdate(bookticket_id, {
        $set: {
            booking_status: "confirmed",
            payment_status: "paid"
        }
    }, { new: true, runValidators: true })
    if (!final_booking_ticket) {
        return res.json({ status: 400, message: "booking failed" })
    }
    return res.json(new ApiResponse(200, true, "booking is confirmed", final_booking_ticket))
})
const cancellation_flight = asynchandler(async (req, res) => {
    const { bookticket_id } = req.params
    if (!bookticket_id) {
        return res.json({ status: 400, message: "bookticket_id is missing" })
    }
    const booking = await Booking.findById(bookticket_id)
    if (!booking) {
        return res.json({ status: 404, message: "booking not found" })
    }
    if (booking.booking_status == "cancelled") {
        return res.json({ status: 400, message: `booking is already ${booking.booking_status}` })
    }
    const flight = await FlightModel.findById(booking.flight_id)
    if (!flight) {
        return res.json({ status: 404, message: "flight not found" })
    }
    if (booking.full_plane_booked == true) {
        const updateavailable_seats = booking.seats_booked;
        const update_flight = await FlightModel.findByIdAndUpdate(booking.flight_id, {
            $set: {
                availableSeats: updateavailable_seats,
                status: "available"
            }
        }, { new: true, runValidators: true })
        if (!update_flight) {
            return res.json({ status: 404, message: "flight not found" })
        }
    }
    else {
        const updateavailable_seats = flight.availableSeats + booking.seats_booked;
        const update_flight = await FlightModel.findByIdAndUpdate(booking.flight_id,{
            $set:{
                availableSeats:updateavailable_seats,
                status:"available"
            }
        },{new:true,runValidators:true})
        if(!update_flight){
            return res.json({ status: 404, message: "flight not found" })
        }
    }
    const update_booking_ticket = await Booking.findByIdAndUpdate(bookticket_id, {
        $set: {
            booking_status: "cancelled",
            is_payment_refund_applied: true
        }
    })
    if (!update_booking_ticket) {
        return res.json({ status: 400, message: "booking failed" })
    }
    return res.json(new ApiResponse(200, true, "booking is cancelled", update_booking_ticket))
})
const get_all_confirmed_booking=asynchandler(async(req,res)=>{
    const booking=await Booking.find({booking_status:"confirmed"}).populate("flight_id").populate("user_id")
    if(!booking){
        return res.json({status:404,message:"booking not found"})
    }
    return res.json(new ApiResponse(200,true,"all the confirmed booking",booking))
})
const get_specific_booking=asynchandler(async(req,res)=>{
    const {bookingticket_id}=req.params
    if(!bookingticket_id){
        return res.json({status:400,message:"booking id is required"})
    }
    const booking_ticket=await Booking.findById(bookingticket_id).populate("flight_id").populate("user_id")
    if(!booking_ticket){
        return res.json({ status: 404, message: "booking not found" })
    }
    return res.json(new ApiResponse(200,true,"the detail of your booking",booking_ticket))
})
const get_all_booking_by_user=asynchandler(async(req,res)=>{
    const {user_id}=req.params
    if(!user_id){
        return res.json({status:400,message:"user id is required"})
    }
    const booking=await Booking.find({user_id:user_id,booking_status:"confirmed"}).populate("flight_id").populate("user_id")
    if(!booking){
        return res.json({status:404,message:"booking not found"})
    }
    return res.json(new ApiResponse(200,true,"all the booking of user",booking))
})
const get_all_confirmed_booking_of_flight=asynchandler(async(req,res)=>{
    const {flight_id}=req.params
    if(!flight_id){
        return res.json({status:404,message:"flight id is missing"})
    }
    const booking=await Booking.find({flight_id:flight_id,booking_status:"confirmed"}).populate("flight_id").populate("user_id")
    if(!booking){
        return res.json({status:404,message:"booking not found"})
    }
    return res.json(new ApiResponse(200,true,"all the booking of flight",booking))
})
export {add_booking,after_payment_booking,cancellation_flight,get_all_confirmed_booking,get_specific_booking,get_all_booking_by_user,get_all_confirmed_booking_of_flight}