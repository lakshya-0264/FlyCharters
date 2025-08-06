import mongoose, { Schema, model } from "mongoose";
const fleet_schema = new Schema({
  operatorId: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  name: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  isAdminVerify: {
    type: Boolean,
    default: false
  },
  model: {
    type: String,
    required: true,
  },
  eom: {
    type: String, // Changed to string to store only year
    required: true,
  },
  validityTill: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["available", "unavailable", "unmaintenance"],
    default: "unavailable",
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
fleetInnerImages: {
  type: [String],
  default: [],
  required: true,
},
  aircraftRegn: {
    type: String,
    required: true
  },
  auw: {
    type: String,
    enum: ["below 5700kgs", "above 5700kgs"],
    required: true
  },
  cruisingSpeed: {
    type: Number,
    required: true
  },
  cruisingLevel: {
    type: Number,
    required: true
  },
  aircraftBase: {
    type: Schema.Types.ObjectId,
    ref: "Airport"
  },
  price_per_hour: {
    type: Number,
    required: true,
  },
  isAbleToLandUncontrolled: {
    type: Boolean,
    required: true,
  },
  isPerformanceLimited: {
    type: Boolean,
    required: true,
  },
  isAbleToLandShortRunway: {
    type: Boolean,
    required: true,
  },
  price_per_seat: {
    type: Number,
    required: true
  },
  petFriendly: {
  type: Boolean,
  required: true,
},
  full_plane_price: {
    type: Number,
    required: true
  },
  booked_dates: [
    { date: { type: Date } }
  ]
}, { timestamps: true });

export const FleetModel = model("Fleet", fleet_schema);