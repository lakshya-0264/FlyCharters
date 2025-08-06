import { Router } from "express";
import { authmiddleware } from "../../Middlewares/user_authentication_middleware.js";
import { GetMessages } from "../../Controllers/messages_controller.js/messages_controller.js";

const message_route = Router();

//Messages routes
message_route.get('/getmessages',authmiddleware,GetMessages);

export {message_route}