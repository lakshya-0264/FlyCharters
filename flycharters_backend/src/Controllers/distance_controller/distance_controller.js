import { Distance_Model } from "../../Models/DistanceModel.js"
import { asynchandler } from "../../Helpers/asynchandler.js"
import { ApiResponse } from "../../Helpers/apiresponse.js";
const createDistance = asynchandler(async (req, res) => {
    const { from, to, distance } = req.body;
    if (!from || !to || !distance) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    if (from === to) {
        return res.status(400).json({ message: "From and To airports must be different" });
    }
    const existing = await Distance_Model.findOne({
        $or: [
            { from, to },
            { from: to, to: from }
        ]
    });

    if (existing) {
        return res.status(409).json({ message: "Distance already exists between these airports (in either direction)" });
    }

    const newDistance = new Distance_Model({ from, to, distance });
    await newDistance.save();
    return res.json(new ApiResponse(200, true, "distance added successfully", newDistance))
})
const getdistancebetweenairport = asynchandler(async (req, res) => {
    const { fromId, toId } = req.params;
    const distance_details = await Distance_Model.findOne({
        $or: [
            { from: depart_id, to: arrival_id },
            { from: arrival_id, to: depart_id }
        ]
    }).populate("from").populate("id");

    if (!distance_details) {
        return res.status(404).json({ message: "Distance not found between given airports" });
    }
    return res.json(new ApiResponse(200, true, "got the distance", distance))
})
const get_all_distance = asynchandler(async (req, res) => {
    const distances = await Distance_Model.find().populate("from").populate("to")
    return res.json(new ApiResponse(200, true, "all_the distance", distances));
})
export { get_all_distance, getdistancebetweenairport, createDistance }