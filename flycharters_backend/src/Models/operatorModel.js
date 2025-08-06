import mongoose, { Schema, model } from "mongoose";

const operator_schema = new Schema({
  operatorid: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  company_name:{
    type:String,
    required:true
  },
  rejection_reason: {
    type: String,
    default: "",
  },
  verified_documents: {
    type: Boolean,
    default: false,
  },
  uploaded_time: {
    type: Date,
    default: null,
  },
  verified_time: {
    type: Date,
    default: null,
  },
  documents: {
    type: [String],
    // Uncomment if you want to validate cloudinary URLs
    // validate: {
    //   validator: function (arr) {
    //     return arr.every(url => typeof url === "string" && url.startsWith("https://res.cloudinary.com/"));
    //   },
    //   message: "All documents must be valid Cloudinary URLs.",
    // },
    default: [],
  },
  name:{
    type: String,
    required: true,
  },
  pointOfContact:{
    type: String,
    required: true,
  },
  location:{
    type: String,
    required: true,
  },
  aopNo: {
    type: String,
    required: true,
  },
  aopValidity: {
    type: String, 
    required: true,
  },
  numAircraft: {
    type: Number,
    required: true,
    min: 0,
  },
  nsopBase: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export const Operator_Model = model("operator_schema", operator_schema);
