import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import { ApiError } from "../apierror.js";
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
})
const uploadfile=async(localfilepath)=>{
    try{
        if(!localfilepath) return null;
        const fileresponsefromcloud=await cloudinary.uploader.upload(localfilepath,{
            resource_type:"auto",
        })
        // console.log(fileresponsefromcloud)
        fs.unlinkSync(localfilepath)
        return fileresponsefromcloud
    }
    catch(err){
        console.log(err)
        fs.unlinkSync(localfilepath)
        return null;
    }
}
const deletefile=async(cloudinaryfileurl)=>{
    try{
        if(!localfilepath){
            throw new ApiError(400,"cloudinary file path is missing")
        }
        const response=await cloudinary.uploader.destroy(cloudinaryfileurl)
        // console.log(response)
        return response
    }
    catch{
        console.log(err);
        return null;
    }
}
export {uploadfile,deletefile}