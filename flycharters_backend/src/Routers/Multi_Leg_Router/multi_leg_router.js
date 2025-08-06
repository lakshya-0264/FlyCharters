import { Router } from "express";
import { authmiddleware } from "../../Middlewares/user_authentication_middleware.js";
import { generate_quota_multi_leg,get_all_multi_leg_quota,get_quota_by_operator_id} from "../../Controllers/multi_leg_controller/multi_leg_controller";
const Multi_Leg_Router=Router()
Multi_Leg_Router.get()
Multi_Leg_Router.get()
export {Multi_Leg_Router}