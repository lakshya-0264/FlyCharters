import mongoose from "mongoose";
const EmptyLegSchema = new mongoose.Schema({
    empty_leg_id: {
        type: mongoose.Types.ObjectId,
        ref: "EmptyLegModel"
    },
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    booking_status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending"
    },
    payment_status: {
        type: String,
        enum: ["pending", "paid", "cancelled"],
        default: "pending"
    },
    total_amount: {
        type: Number,
        default: 0

    },
    seats_booked: {
        type: Number,
        default: 0
    },
    is_full_plane: {
        type: Boolean,
        default: false
    },
    is_payment_refund: {
        type: Boolean,
        default: false
    },
    petDetails: {
        isPet: { type: Boolean, default: false },
        type: { type: String },
        specify: { type: String },
        weight: { type: Number },
        vaccinationCertificate: { type: [String], required: true, }, // store file path or cloud URL
        sitToTravelCertificate: { type: Boolean, default: false },
        agreePetPolicy: { type: Boolean, default: false }
    },
    corporateDetails: {
        isCorporate: { type: Boolean, default: false},
        companyName: { type: String },
        companyId: { type: String }
    },
    passengerDetails: [
        {
            name: { type: String, required: true },
            email: { type: String },
            phone: { type: String },
            passport: { type: String},
            nationality: { type: String, required: true },
            gender: { type: String, enum: ["male", "female", "others"]},
        }
    ],
}, { timestamps: true})
const EmptyLegBookingModel = mongoose.model("EmptyLegBookingModel", EmptyLegSchema)
export { EmptyLegBookingModel }