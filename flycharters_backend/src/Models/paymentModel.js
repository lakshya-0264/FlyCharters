import mongoose,{Schema,model} from "mongoose";
const PaymentSchema = new mongoose.Schema({
  flight_id:{type:mongoose.Schema.Types.ObjectId,ref:"FlightModel"},
  order_id: { type: String, required: true, unique: true },
  cf_order_id: { type: Number, required: true },
  order_amount: { type: Number, required: true },
  order_currency: { type: String, default: "INR" },
  order_status: { type: String, required: true },
  payment_session_id: { type: String },
  created_at: { type: Date },
  order_expiry_time: { type: Date },

  customer_details: {
    customer_id: { type: String },
    customer_name: { type: String },
    customer_email: { type: String },
    customer_phone: { type: String },
    customer_uid: { type: String }
  },

  order_meta: {
    return_url: { type: String },
    notify_url: { type: String },
    payment_methods: { type: String }
  },

  payments_url: { type: String },
  refunds_url: { type: String },
  settlements_url: { type: String },

  order_note: { type: String },
  order_tags: { type: mongoose.Schema.Types.Mixed }, // if tags are in object format
  order_splits: { type: [mongoose.Schema.Types.Mixed], default: [] },

  terminal_data: { type: mongoose.Schema.Types.Mixed }, // usually null
}, { timestamps: true }); // Adds createdAt and updatedAt

export const Payment_Model=model("Payment_Model",PaymentSchema)