import { asynchandler } from "../../Helpers/asynchandler.js";
import { ApiError } from "../../Helpers/apierror.js";
import { ApiResponse } from "../../Helpers/apiresponse.js";
import { NotificationModel } from "../../Models/NotificationModel.js"

const GetNotification = asynchandler(async (req,res)=>{
    const notification = await NotificationModel.find({recipient:req.user._id});
    if (!notification){
        throw new ApiError(404, "notification not found");
    }
    return res.json(new ApiResponse(200, true, "notification fetched successfully", notification))
})

const markNotificationsAsRead = asynchandler(async (req, res) => {
    const result = await NotificationModel.updateMany(
        { recipient: req.user._id, isRead: false },
        { $set: { isRead: true } }
    );

    if (result.modifiedCount === 0) {
        return res.json(new ApiResponse(200, true, "No unread notifications found"));
    }

    return res.json(new ApiResponse(200, true, "Notifications marked as read"));
});

export {GetNotification,markNotificationsAsRead};