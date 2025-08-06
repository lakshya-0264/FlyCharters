import { Router } from "express";
import { upload } from "../../Middlewares/multerMiddleware.js";
import { authmiddleware } from "../../Middlewares/user_authentication_middleware.js";
import {AddAircraft,DeleteAircraft,UpdateAllAirCraft,GetAirCraftByFleetId,GetAirCraftById,GetAirCraftByOperatorId,GetAllAirCraft} from "../../Controllers/aircraft_controller/aircraft_controller.js"
const AirCraftRouter=Router()
AirCraftRouter.get('/allcraft',authmiddleware,GetAllAirCraft)
AirCraftRouter.get('/fleetcraft/:fleet_id',authmiddleware,GetAirCraftByFleetId)
AirCraftRouter.get('/craftbyId/:Aircraft_id',authmiddleware,GetAirCraftById)
AirCraftRouter.get('/craftidoper',authmiddleware,GetAirCraftByOperatorId)
AirCraftRouter.post('/creacraft/:fleetid',authmiddleware,upload.array('documents',2),AddAircraft)
AirCraftRouter.delete('/delcraft/:aircraft_id',authmiddleware,DeleteAircraft)
AirCraftRouter.patch('/updcraft/:aircraft_id',authmiddleware,UpdateAllAirCraft)
export {AirCraftRouter}