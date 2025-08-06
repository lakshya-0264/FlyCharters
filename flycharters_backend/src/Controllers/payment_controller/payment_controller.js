import { asynchandler } from "../../Helpers/asynchandler.js";
import { ApiError } from "../../Helpers/apierror.js";
import { Payment_Model } from "../../Models/paymentModel.js";
import { FlightModel } from "../../Models/flightsModel.js";
import { ApiResponse } from "../../Helpers/apiresponse.js";
import axios from "axios";
import { APP_ID } from "../../Helpers/payment_util.js";
import { SECRET_KEY } from "../../Helpers/payment_util.js";
import { FleetModel } from "../../Models/fleetModel.js";
const create_order = asynchandler(async (req, res) => {
    const { flight_id } = req.params
    const flight = await FlightModel.findById(flight_id).populate([
        {
            path: "quote_id"
        },
        {
            path: "user_id"
        }
    ])
    if (!flight) {
        return res.status(404).json({ message: "flight not found" })
    }
    //console.log(flight)
    const orderId = `ORDER_${Date.now()}`;
    let amount = flight.quote_id.total_cost_with_gst + flight.handling_fee
    const payload = {
        order_id: orderId,
        order_amount: Number(amount.toFixed(2)),
        order_currency: 'INR',
        customer_details: {
            customer_id: String(flight.user_id._id),
            customer_email: flight.user_id.email,
            customer_phone: flight.user_id.phone
        },
        order_meta: {
            return_url:  process.env.FRONT_END_URL + "/user/payment-status?order_id=" + orderId
        }
    };
    console.log(payload)
    const response = await axios.post(
        'https://sandbox.cashfree.com/pg/orders',
        payload,
        {
            headers: {
                'x-client-id': APP_ID,
                'x-client-secret': SECRET_KEY,
                'x-api-version': '2022-09-01',
                'Content-Type': 'application/json'
            }
        }
    );
    let sessionId = response.data.payment_session_id;
    return res.json({ order_id: orderId, session_id: sessionId });
})
const payment_status = asynchandler(async (req, res) => {
    const orderId = req.query.order_id;
    const response = await axios.get(`https://sandbox.cashfree.com/pg/orders/${orderId}`, {
        headers: {
            "x-client-id": APP_ID,
            "x-client-secret": SECRET_KEY,
            'x-api-version': '2022-09-01',
            "Content-Type": "application/json"
        }
    });
    const data=response.data
    const paymentDoc = new Payment_Model({
      order_id: data.order_id,
      cf_order_id: data.cf_order_id,
      order_amount: data.order_amount,
      order_currency: data.order_currency,
      order_status: data.order_status,
      payment_session_id: data.payment_session_id,
      created_at: data.created_at,
      order_expiry_time: data.order_expiry_time,
      customer_details: data.customer_details,
      order_meta: data.order_meta,
      payments_url: data.payments?.url,
      refunds_url: data.refunds?.url,
      settlements_url: data.settlements?.url,
      order_note: data.order_note,
      order_tags: data.order_tags,
      order_splits: data.order_splits,
      terminal_data: data.terminal_data
    });
    await paymentDoc.save();
    return res.json(new ApiResponse(200, true, "payment_made_successfully", paymentDoc));
})
const updation_after_payment=asynchandler(async(req,res)=>{
    const {payment_id,flight_id}=req.params
    const paymentDoc=await Payment_Model.findById(payment_id)
    const flight=await FlightModel.findById(flight_id).populate([
        {
            path:"quote_id"
        }
    ])
    if(!paymentDoc || !flight){
        return res.json(new ApiResponse(404,"payment_not_found"))
    }
    await Payment_Model.findByIdAndUpdate(payment_id,{
        $set:{
            flight_id:flight_id
        }
    },{runValidators:true,new:true})
    if(paymentDoc.order_status=="PAID"){
        await FlightModel.findByIdAndUpdate(flight_id,{
            $set:{
                payment_status:"booked"
            }
        },{runValidators:true,new:true})
        const date_Str=flight.quote_id.departureDate
        const upd_date=new Date(date_Str)
        const fleet=await FleetModel.findById(flight.quote_id.fleet_request_id)
        fleet.booked_dates.push({date:upd_date})
        await fleet.save();
        return res.json(new ApiResponse(200,true,"flight booked successfully",paymentDoc))
    }
    return res.json(new ApiResponse(200,true,"some error in flight booking",paymentDoc))
})
const get_all_payment=asynchandler(async(req,res)=>{
    const payment=await Payment_Model.find()
    if(!payment){
        return res.json(new ApiResponse(404,"no_payments_found"))
    }
    return res.json(new ApiResponse(200,true,"all_payment_fetched",payment))
})
export { create_order,payment_status,get_all_payment,updation_after_payment}
