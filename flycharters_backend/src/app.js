import express, { urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import cors from "cors"
import { authRouter } from './Routers/User_Router/user_router.js';
import { FleetRouter } from './Routers/Fleet_Router/fleet_router.js';
import { Operator_Router } from './Routers/Operator_Router/operator_router.js';
import { AirCraftRouter } from './Routers/Aircraft_Router/aircraft_router.js';
import { Airport_Router } from './Routers/Airport_Router/airport_router.js';
import { flight_Router } from "./Routers/Flight_Router/flight_router.js"
import { Empty_Router } from './Routers/EmptyLeg_Router/emptyleg_router.js';
import { EmptyLegBookingRouter } from './Routers/Empty_Leg_Booking/empty_leg_booking.js';
import { Quote_Router } from "./Routers/Quote_Router/quote_router.js"
import { Distance_Router } from './Routers/Distance_Router/distance_router.js';
import { generateInvoicePDF } from './Helpers/generate_pdf.js';
import axios from "axios"
import { Payment_Router } from './Routers/Payment_Router/payment_router.js';
import { Invoice_Router } from './Routers/Invoice_Router/invoice_router.js';
import multer from 'multer';
import { Distance_Model } from './Models/DistanceModel.js';
import fs from "fs"
import csv from "csv-parser"
const app = express();
const APP_ID = process.env.Cashfree_API_ID;
const SECRET_KEY = process.env.Cashfree_API_KEY;
import { specs } from './swagger.js';
import swaggerUi from "swagger-ui-express"
import { AnalyticsRouter } from './Routers/Analytics_Router/analyticsRoutes.js';
//console.log(APP_ID)
//console.log(SECRET_KEY)
const uploads = multer({ dest: 'uploads/' })
app.use(urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true,
}))
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(specs,{
    explorer:true,
    customSiteTitle: "API Documentation",
    customCss: '.swagger-ui .topbar { display: none }'
}))
app.use('/auth', authRouter)
app.use('/fleet', FleetRouter)
app.use('/ope', Operator_Router)
app.use('/air', AirCraftRouter)
app.use('/air_port', Airport_Router)
app.use("/flight", flight_Router)
app.use("/empty", Empty_Router)
app.use("/emptylegbooking", EmptyLegBookingRouter)
app.use("/distance", Distance_Router)
app.use("/qu", Quote_Router)
app.use("/pay", Payment_Router)
app.use("/invoice", Invoice_Router)
app.use('/analytics',AnalyticsRouter)
app.post('/upload', uploads.single('file'), (req, res) => {
    const results = [];
    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => {
            // convert distance_km to number
            results.push({
                from: data.from,
                to: data.to,
                distance: Number(data.distance),
            });
        })
        .on('end', async () => {
            console.log(results)
            try {
                await Distance_Model.insertMany(results);
                fs.unlinkSync(req.file.path); // delete the file after processing
                res.send({ message: 'Data uploaded successfully', count: results.length });
            } catch (err) {
                res.status(500).send({ error: err.message });
            }
        });
})
app.delete('/del',async(req,res)=>{
    try{
        await Distance_Model.deleteMany();
        return res.status(200).json({message:"all deleted successfully"})
    }
    catch(err){
        res.status(500).send({error:err.message})
    }
})
app.use((err, req, res, next) => {
    console.error("Error:", err);
    if (err) {
        return res.status(err.statuscode).json({
        success: false,
        message: err.message,
        details: err.details || null,
        });
    }
    return res.status(500).json({ success: false, message: "Internal Server Error" });
});
export { app }
