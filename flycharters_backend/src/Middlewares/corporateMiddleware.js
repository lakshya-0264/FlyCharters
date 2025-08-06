import { asynchandler } from "../Helpers/asynchandler.js";
import { ApiError } from "../Helpers/apierror.js";
export const RoleBasedMiddleware=asynchandler(async(req,res)=>{
    if(req.user.role=="corporate"){
        next()
    }
    else{
        throw new ApiError(400,"this api is not meant for you")
    }
})