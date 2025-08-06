import { Router } from "express";
import { authmiddleware } from "../../Middlewares/user_authentication_middleware.js";
import { GetNotification, markNotificationsAsRead } from "../../Controllers/notification_controller/notification_controller.js";

const notify_route = Router();

//notification routes
notify_route.get('/getNotification',authmiddleware,GetNotification);
notify_route.patch("/notifications/mark-read", authmiddleware, markNotificationsAsRead);

export {notify_route}