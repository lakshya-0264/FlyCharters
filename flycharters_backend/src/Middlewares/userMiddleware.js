import { asynchandler } from "../Helpers/asynchandler.js";
import { ApiError } from "../Helpers/apierror.js";
export const UserBasedMiddleware=asynchandler(async(req,res,next)=>{
    if(req.user.role=="user"){
        next()
    }
    else{
        throw new ApiError(400,"this api is not meant for you")
    }
})