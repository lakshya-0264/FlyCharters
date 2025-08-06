import mongoose from "mongoose";
const emptylegSchema = new mongoose.Schema({
    fleet_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Fleet",
        required: true
    },
    takeOff_Airport:{
        type: mongoose.Types.ObjectId,
        ref: "Airport",
        required: true
    },
    destination_Airport:{
        type: mongoose.Types.ObjectId,
        ref: "Airport",
        required: true
    },
    departureDate: {
        type: Date,
        required: true
    },
    departureTime: {
        type: String,
        required: true
    },
    arrivalDate: {
        type: Date,
        required: true
    },
    arrivalTime: {
        type: String,
        required: true
    },
    priceperseat: {
        type: Number,
        required: true,
    },
    full_plane_price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['available', 'booked', 'cancelled'],
        default: 'available'
    }
})
const EmptyLegModel = mongoose.model("EmptyLegModel", emptylegSchema)
export { EmptyLegModel }