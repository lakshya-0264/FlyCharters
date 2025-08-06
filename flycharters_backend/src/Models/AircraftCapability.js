import mongoose from 'mongoose';

const CapabilityPeriodSchema = new mongoose.Schema({
  date_from: { type: Date, required: true },
  date_to: { type: Date, required: true },
  time_from: { type: String, required: true }, // Format: "HH:mm"
  time_to: { type: String, required: true },   // Format: "HH:mm"
  note: { type: String }
}, { _id: false });

const AircraftCapabilitySchema = new mongoose.Schema({
  aircraft_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Fleet',
    required: true 
  },
  airport_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Airport',
    required: true 
  },
  capability_type: {
    type: String,
    enum: ['PerformanceLimited', 'Uncontrolled', 'ShortRunway'],
    required: true
  },
  restriction_period: {
    type: CapabilityPeriodSchema,
    required: true
  },
  created_at: { type: Date, default: Date.now }
});


AircraftCapabilitySchema.index(
  { aircraft_id: 1, airport_id: 1, capability_type: 1 }, 
  { unique: true }
);

const AircraftCapability = mongoose.model('AircraftCapability', AircraftCapabilitySchema);
export default AircraftCapability;