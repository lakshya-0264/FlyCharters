import { asynchandler } from "../../Helpers/asynchandler.js";
import { ApiError } from "../../Helpers/apierror.js";
import { ApiResponse } from "../../Helpers/apiresponse.js";
import { Message } from "../../Models/ChatModel.js";

const GetMessages = asynchandler(async (req,res)=>{
    const { user1, user2 } = req.query;
    if (!user1 || !user2) {
        throw new ApiError(404, "missing users")
    };
    try {
        const messages = await Message.find({
            $or: [
                { sender: user1, recipient: user2 },
                { sender: user2, recipient: user1 }
            ]
        }).sort({ createdAt: 1 });

        res.json(messages.map(m => ({
            fromUserId: m.sender,
            toUserId: m.recipient,
            message: m.message,
            timestamp: m.createdAt
        })));
    } catch (err) {
        throw new ApiError(500, `server error ${err}`);
    }
})

export {GetMessages};