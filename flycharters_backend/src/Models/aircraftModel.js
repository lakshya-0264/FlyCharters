import mongoose, { Schema, model } from "mongoose";
const aircraft_schema = new Schema({
    fleet_id: {
        type: Schema.Types.ObjectId,
        ref: "fleet_schema"
    },
    operatorid: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    name: {
        type: String,
        required: true
    },
    aircraftType: {
        type: String,
        required: true,
        enum: [
            "Single engine turbo-prop",
            "Twin engine turbo-prop",
            "Single engine light jet",
            "Twin engine light jet",
            "Twin engine Medium jet",
            "Twin engine large jet",
            "Triple engine large jet",
            "Single engine piston helicopter",
            "Singe engine turbine helicopter",
            "Twin engine turbine helicopter"

        ]
    },
    manufacture_year: {
        type: Date,
        required: true
    },
    seating_capacity: {
        type: Number,
        required: true,
    },
    cruising_speed: {
        type: Number,
        required: true,
    },
    cruising_level: {
        type: Number,
        required: true,
    },
    aircraft_base: {
        type: String,
        required: true
    },
    pilots: {
        type: Number,
        required: true,
    },
    cabinCrew: {
        type: Number,
        required: true,
    },
    flyingRange: {
        type: String
    },
    flight_image: {
        type: [String],
        required: true,
        validate: {
            validator: (arr) => arr.length >= 2 && arr.length <= 5,
            message: "fleet Inner Images must contain between 2 and 5 images.",
        },
    }
}, { timestamps: true })
export const AircraftModel = model("aircraft_schema", aircraft_schema)