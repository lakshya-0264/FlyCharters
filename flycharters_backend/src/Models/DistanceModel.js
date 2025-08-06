import mongoose from "mongoose";
const Distance_Schema = new mongoose.Schema({
    from: {
        type:mongoose.Types.ObjectId,
        ref:"Airport",
        required:true
    },
    to: {
        type:mongoose.Types.ObjectId,
        ref:"Airport",
        required:true
    },
    distance: {
        type: Number, // in Nautical Miles
        required: true,
    }
})
const Distance_Model = mongoose.model("Distance_Model", Distance_Schema)
export {Distance_Model}