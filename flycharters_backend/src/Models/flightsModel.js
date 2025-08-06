import mongoose from 'mongoose';
const flightSchema = new mongoose.Schema({
  quote_id: {
    type: mongoose.Types.ObjectId,
    ref: "Quote_Model",
    required: true,
    index: true
  },
  pnr: {
    type: String
  },
  user_id: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  payment_status: {
    type: String,
    enum: ["booked", "cancelled","available"],
    default: "available"
  },
  other_add_ons_details:[
    {type:mongoose.Types.ObjectId,ref:"Payment_Model"}
  ],
  petDetails: {
    isPet: { type: Boolean, default: false },
    type: { type: String, default: undefined },
    specify: { type: String, default: undefined },
    weight: { type: Number, default: undefined },
    vaccinationCertificate: { type: [String], default: [] },
    sitToTravelCertificate: { type: Boolean, default: false },
    agreePetPolicy: { type: Boolean, default: false }
  },
  corporateDetails: {
    isCorporate: { type: Boolean, default: false },
    companyName: { type: String, default: undefined },
    companyId: { type: String, default: undefined }
  },
  party_addon: {
    event_name: {
      type: String,
      enum: ["Anniversary", "Birthday"],
      default: undefined
    },
    route: {
      type: String,
      enum: ["departure_way", "arrival_way", "both"],
      default: undefined
    }
  },
  transport_facility: {   // renamed for clarity
    type: Boolean,
    default: false
  },
  food_service_addon: [
    {
      name: { type: String, required: true },
      food_type: {
        departure_way: {
          type: String,
          enum: ["snacks", "lunch", "buffet"],
          default: undefined
        },
        arrival_way: {
          type: String,
          enum: ["snacks", "lunch", "buffet"],
          default: undefined
        }
      },
      route: {
        type: String,
        enum: ["departure_way", "arrival_way", "both"],
        required: true
      }
    }
  ],
  handling_fee: {
    type: Number,
    required: true
  },

  booking_time: {
    type: Date,
    default: Date.now
  },

  passengerDetails: [
    {
      name: { type: String, required: true },
      email: { type: String, default: undefined },
      phone: { type: String, default: undefined },
      passport: { type: String, default: undefined },
      nationality: { type: String, required: true },
      gender: {
        type: String,
        enum: ["male", "female", "others"],
        default: undefined
      }
    }
  ],

  is_round_trip: {
    type: Boolean,
    required: true
  }

});

const FlightModel = mongoose.model('FlightModel', flightSchema);

export { FlightModel };
