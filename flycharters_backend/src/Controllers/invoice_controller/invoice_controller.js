import { asynchandler } from "../../Helpers/asynchandler.js";
import ejs from "ejs"
import puppeteer from 'puppeteer';
import path from "path"
import { fileURLToPath } from "url";
import { EmptyLegBookingModel } from "../../Models/emptylegbookingModel.js";
import { FleetModel } from "../../Models/fleetModel.js";
import { AirportModel } from "../../Models/AirportModel.js";
import { Payment_Model } from "../../Models/paymentModel.js";
import { addonPrice } from "../../Helpers/add_on_price.js";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const additional_addons = asynchandler(async (req, res) => {
    const {flight_id,payment_id}=req.params
    const {transport_facility,food_service_addon,party_addon}=req.body
    
    if(!flight_id){
        return res.status(400).json({msg:"Flight id is required"})
    }
    
    const flight = await FlightModel.findById(flight_id).populate("quote_id").populate("user_id")
    const payment_details=await Payment_Model.findById(payment_id)
    
    if(!flight || !payment_details){
        return res.status(404).json({msg:"Flight not found"})
    }
    
    const fleet=await FleetModel.findById(flight.quote_id.fleet_request_id)
    if(!fleet){
        return res.status(404).json({msg:"Fleet not found"})
    }
    
    const depart_id=flight.quote_id.deparature_airport_id
    const arrival_id=flight.quote_id.destination_airport_id 
    
    if(!depart_id || !arrival_id){
        return res.status(404).json({msg:"Departure or Arrival airport not found"})
    }
    
    const depart_air=await AirportModel.findById(depart_id)
    const arrival_air=await AirportModel.findById(arrival_id)
    
    if(!depart_air || !arrival_air){
        return res.status(404).json({msg:"Departure or Arrival airport not found"})
    }
    
    let total_party_addon_cost=0;
    let total_food_cost=0;
    let transport_cost=0;
    
    if(transport_facility){
        transport_cost=addonPrice.transport_facility.price_per_person*flight.passengerDetails
    }
    
    if(party_addon){
        const { event_name,route}=party_addon
        if(route=="both"){
            total_party_addon_cost=event_name=="Anniversary" ? addonPrice.party_addon.Anniversary*2:addonPrice.party_addon.Birthday*2
        }
        else{
            total_party_addon_cost=event_name=="Anniversary" ? addonPrice.party_addon.Anniversary:addonPrice.party_addon.Birthday
        }
    }
    
    if(food_service_addon){
        for(let i=0;i<food_service_addon.length;i++){
            const {food_type,route}=food_service_addon[i]
            if(route=="both"){
                total_food_cost+=addonPrice.food_service_addon.food_type.departure_way
                total_food_cost+=addonPrice.food_service_addon.food_type.arrival_way
            }
            else{
                if(food_type.departure_way!=undefined){
                    total_food_cost+=addonPrice.food_service_addon.food_type.departure_way
                }
                else{
                    total_food_cost+=addonPrice.food_service_addon.food_type.arrival_way
                }
            }
        }
    }
    
    let total_cost=total_food_cost+transport_cost+total_party_addon_cost
    let gst_per=18
    let gst_amount=(total_cost*gst_per)/100;
    
    const invoice_main = {
        date:new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        pnr: flight.pnr,
        customerName: flight.user_id.firstName,
        customerContact: flight.user_id.phone,
        currency: 'INR',
        currencySymbol: '₹',
        flightDetails: {
            aircraft: fleet.name,
            dateOfTravel: flight.quote_id.departureDate,
            departureCity: depart_air.source_IATA,
            destinationCity: arrival_air.source_IATA,
        },
        addOnItems: [
            {
                description: 'Transport Facility',
                avail: transport_facility ? "yes":"no",
                total: transport_cost,
            },
            {
                description: 'Food Service Addon',
                avail: food_service_addon && food_service_addon.length > 0 ? "yes" : "no",
                total: total_food_cost,
            },
            {
                description: 'Party Addon',
                avail: party_addon ? "yes":"no",
                total: total_party_addon_cost,
            },
        ],
        subtotal: total_cost,
        gstPercentage: gst_per,
        gstAmount: gst_amount,
        grandTotal: total_cost+gst_amount,
        paymentMethod: payment_details.order_meta?.payment_methods || 'N/A',
        paymentStatus: 'Paid',
        transactionId: payment_details.payments_url || payment_details.order_id,
    };
    
    const templatePath = path.join(__dirname, "../../Helpers/additional_addontemplate.ejs")
    const html = await ejs.renderFile(templatePath, { invoice_main })
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] })
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'domcontentloaded' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=addon-invoice.pdf');
    res.send(pdfBuffer);
})

const empty_leg_invoice = asynchandler(async (req, res) => {
    console.log('🚀 Starting empty_leg_invoice function');
    console.log('📨 Request body:', req.body);
    console.log('📨 Request params:', req.params);
    
    try {
        const {empty_booking_id, payment_id} = req.body;
        console.log('🔍 Extracted IDs:', { empty_booking_id, payment_id });
        
        if(!empty_booking_id){
            console.log('❌ Missing empty_booking_id');
            return res.status(400).json({message: "empty_booking_id is required"});
        }

        console.log('🔄 Fetching empty booking details...');
        
        // First, let's try a simple find without population to see if the record exists
        const basicBooking = await EmptyLegBookingModel.findById(empty_booking_id);
        console.log('📋 Basic booking found:', !!basicBooking);
        
        if (!basicBooking) {
            console.log('❌ Empty booking not found with ID:', empty_booking_id);
            return res.status(404).json({message: "Empty booking not found"});
        }
        
        console.log('📋 Basic booking data:', {
            id: basicBooking._id,
            empty_leg_id: basicBooking.empty_leg_id,
            user_id: basicBooking.user_id,
            seats_booked: basicBooking.seats_booked
        });

        // Now try with population
        console.log('🔄 Fetching with population...');
        const empty_booking_details = await EmptyLegBookingModel.findById(empty_booking_id)
            .populate('empty_leg_id')
            .populate('user_id');

        console.log('📋 Populated booking:', {
            hasEmptyLeg: !!empty_booking_details?.empty_leg_id,
            hasUser: !!empty_booking_details?.user_id
        });

        if(!empty_booking_details?.empty_leg_id){
            console.log('❌ Empty leg details not found after population');
            return res.status(404).json({message: "Empty leg details not found"});
        }

        // Get fleet details
        console.log('🔄 Fetching fleet details...');
        const fleet_id = empty_booking_details.empty_leg_id.fleet_id;
        console.log('🆔 Fleet ID:', fleet_id);
        
        let fleet_details = null;
        if (fleet_id) {
            fleet_details = await FleetModel.findById(fleet_id);
            console.log('✈️ Fleet details found:', !!fleet_details);
        }

        // Get airport details
        console.log('🔄 Fetching airport details...');
        const takeoff_id = empty_booking_details.empty_leg_id.takeOff_Airport;
        const destination_id = empty_booking_details.empty_leg_id.destination_Airport;
        console.log('🆔 Airport IDs:', { takeoff_id, destination_id });

        let take_airport_detail = null;
        let arrival_airport_detail = null;

        if (takeoff_id) {
            take_airport_detail = await AirportModel.findById(takeoff_id);
            console.log('🛫 Takeoff airport found:', !!take_airport_detail);
        }

        if (destination_id) {
            arrival_airport_detail = await AirportModel.findById(destination_id);
            console.log('🛬 Arrival airport found:', !!arrival_airport_detail);
        }

        // Get payment details if payment_id is provided
        let payment = null;
        if(payment_id) {
            console.log('🔄 Fetching payment details...');
            payment = await Payment_Model.findById(payment_id);
            console.log('💳 Payment found:', !!payment);
        }

        // Calculate pricing with fallbacks
        console.log('🔄 Calculating pricing...');
        const pricePerSeat = empty_booking_details.empty_leg_id.priceperseat || 0;
        const numberOfPassengers = empty_booking_details.seats_booked || 1;
        const subtotal = pricePerSeat * numberOfPassengers;
        const gstPercentage = 18;
        const gstAmount = subtotal * (gstPercentage / 100);
        const grandTotal = subtotal + gstAmount;

        console.log('💰 Pricing calculated:', {
            pricePerSeat,
            numberOfPassengers,
            subtotal,
            gstAmount,
            grandTotal
        });

        const invoice = {
            date: new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            }),
            bookingId: `BI${empty_booking_details._id}`,
            customerName: empty_booking_details.user_id?.firstName || 'N/A',
            customerContact: empty_booking_details.user_id?.phone || 'N/A',
            currency: payment?.order_currency || 'INR',
            currencySymbol: '₹',
            aircraft: fleet_details?.name || 'N/A',
            departureDate: empty_booking_details.empty_leg_id.departureDate || new Date().toISOString(),
            departureTime: empty_booking_details.empty_leg_id.departureTime || '00:00',
            departureCity: take_airport_detail?.source_IATA || 'N/A',
            destinationCity: arrival_airport_detail?.source_IATA || 'N/A',
            originalRoute: `${take_airport_detail?.source_IATA || 'N/A'} → ${arrival_airport_detail?.source_IATA || 'N/A'}`,
            flightDuration: empty_booking_details.empty_leg_id.duration || 'N/A',
            bookingType: empty_booking_details.is_full_plane ? 'Full Plane' : 'Seats Booked',
            numberOfPassengers: numberOfPassengers,
            totalSeats: fleet_details?.capacity || 'N/A',
            pricePerSeat: pricePerSeat,
            additionalCharges: [],
            subtotal: subtotal,
            gstPercentage: gstPercentage,
            gstAmount: gstAmount,
            grandTotal: grandTotal,
            paymentMethod: payment?.order_meta?.payment_methods || 'N/A',
            paymentStatus: empty_booking_details.payment_status === 'paid' ? 'Paid' : 'Pending',
            transactionId: payment?.payments_url || payment?.order_id || 'N/A',
            dueDate: null,
            bankDetails: null
        };

        console.log('📄 Invoice object created');

        const templatePath = path.join(__dirname, "../../Helpers/empty_template.ejs");
        console.log('📂 Template path:', templatePath);

        // Check if template file exists
        try {
            await import('fs').then(fs => {
                if (!fs.existsSync(templatePath)) {
                    throw new Error('Template file does not exist');
                }
            });
        } catch (error) {
            console.log('❌ Template file check failed:', error.message);
            return res.status(500).json({message: "Invoice template not found at: " + templatePath});
        }

        console.log('🔄 Rendering EJS template...');
        const html = await ejs.renderFile(templatePath, { invoice });
        console.log('✅ EJS template rendered successfully');

        console.log('🔄 Launching Puppeteer...');
        const browser = await puppeteer.launch({ 
            headless: true, 
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] 
        });
        
        const page = await browser.newPage();
        console.log('🔄 Setting page content...');
        await page.setContent(html, { waitUntil: 'domcontentloaded' });
        
        console.log('🔄 Generating PDF...');
        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
        await browser.close();
        console.log('✅ PDF generated successfully');

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=empty-leg-invoice.pdf');
        res.send(pdfBuffer);
        
        console.log('✅ Invoice sent successfully');

    } catch (error) {
        console.error('💥 Error in empty_leg_invoice:', error);
        console.error('📍 Stack trace:', error.stack);
        
        return res.status(500).json({
            message: "Error generating invoice", 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

export { additional_addons, empty_leg_invoice }