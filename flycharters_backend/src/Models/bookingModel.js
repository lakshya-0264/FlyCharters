import mongoose from "mongoose"
const bookingSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    flight_id: {
        type: mongoose.Types.ObjectId,
        ref: "Flight"
    },
    booking_status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending"
    },
    payment_status: {
        type: String,
        enum: ["pending", "paid"],
        default: "pending"
    },
    total_amount: {
        type: Number,
        default: 0
    },
    full_plane_booked: {
        type: Boolean,
        default: false
    },
    seats_booked: {
        type: Number,
        default: 0
    },
    is_payment_refund_applied: {
        type: Boolean,
        default: false
    },
    passengerDetails: [
        {
            name: { type: String, required: true },
            email: { type: String, required: true },
            phone: { type: String, required: true },
            passport: { type: String,required:true },
            nationality: {type:String,required:true},
            gender: {type:String,enum:["male","female","others"],required:true}
        }
    ]

}, { timestamps: true })
const Booking = mongoose.model("Booking", bookingSchema)
export { Booking }