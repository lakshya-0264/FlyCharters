import {z} from "zod"
import mongoose from "mongoose"
export const addfleetschemavalidation=z.object({
    name:z.string().min(5,{message:"minimum 5 character is required"}).max(50,{message:"maximum 50 character is allowed"}),
    capacity: z
    .number({
      required_error: "Capacity is required",
      invalid_type_error: "Capacity must be a number",
    }),
    model:z.string().min(5,{message:"minimum 5 character is required"}).max(100,{message:"maximum 50 character is allowed"}),
    description:z.string().min(15,{message:"minimum 15 character is required"}).max(200,{message:"maximum 200 character is allowed"}),
    fleetImg: z.string().min(1, { message: "Fleet image is required" }),
    fleetInnerImages:z.array(z.string()).min(1,{message:"Mininum one photo is required"}).max(5,{message:"Maximum 5 photo is allowed"})
})