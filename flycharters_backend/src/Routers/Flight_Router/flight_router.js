import { Router } from "express";
import multer from "multer";
import {authmiddleware} from "../../Middlewares/user_authentication_middleware.js"
import {create_flight_request,get_all_flight_by_operator,get_all_flights,get_flight_quoto_id,get_flight_status,get_flight_user_id,updation_after_payment,cancel_flight,update_flight_addons,delete_flight} from "../../Controllers/flight_controller/flight_controller.js"
const flight_Router=Router()

const upload = multer({ dest: "uploads/" });
/**
 * @swagger
 * /flight/create:
 *   post:
 *     tags:
 *       - Flight
 *     summary: Create a new flight booking request
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - fleet_obj
 *               - passengerDetails
 *             properties:
 *               fleet_obj:
 *                 type: string
 *                 description: JSON string containing fleet information
 *                 example: '{"fleet_request_id":"64df36cbea5d1234abcd4567","total_cost":5000,"total_cost_with_gst":5900,"total_time":"2h 30m","total_distance":"500km","leg_distance":"500km","leg_time":"2h 30m","deparature_airport_id":"DEL","destination_airport_id":"BOM","departureDate":"2024-01-15","departureTime":"10:00"}'
 *               passengerDetails:
 *                 type: string
 *                 description: JSON string array of passenger details
 *                 example: '[{"name":"John Doe","nationality":"American","email":"john@example.com","phone":"+1234567890","passport":"A12345678","gender":"Male"}]'
 *               petDetails:
 *                 type: string
 *                 description: JSON string containing pet information
 *                 example: '{"isPet":true,"type":"Dog","specify":"Golden Retriever","weight":25.5,"sitToTravelCertificate":true,"agreePetPolicy":true}'
 *               corporateDetails:
 *                 type: string
 *                 description: JSON string containing corporate booking details
 *                 example: '{"isCorporate":true,"companyName":"Tech Corp Inc","companyId":"TC123456"}'
 *               food_service_addon:
 *                 type: string
 *                 description: JSON string array of food service preferences
 *                 example: '[{"name":"John Doe","departure_way":"vegetarian","arrival_way":"non-vegetarian","route":"departure_way"}]'
 *               is_round_trip:
 *                 type: string
 *                 enum: ["true", "false"]
 *                 example: "false"
 *               transport_facility:
 *                 type: string
 *                 enum: ["0", "1"]
 *                 example: "0"
 *               party_addon:
 *                 type: string
 *                 description: JSON string containing party addon details
 *                 example: '{"event_name":"birthday","route":"departure_way"}'
 *               handling_fee:
 *                 type: string
 *                 example: "100"
 *               vaccinationCertificate:
 *                 type: string
 *                 format: binary
 *                 description: Pet vaccination certificate (required if pet details provided)
 *     responses:
 *       200:
 *         description: Flight booking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Flight created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/FlightResponse'
 *       400:
 *         description: Bad request - validation errors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid fleet object"
 *       500:
 *         description: Internal server error
 */

flight_Router.post('/create',authmiddleware,upload.fields([{ name: "vaccinationCertificate", maxCount: 1 }]), create_flight_request);
/**
 * @swagger
 * /flight/all:
 *   get:
 *     tags:
 *       - Flight
 *     summary: Get all flight bookings
 *     responses:
 *       200:
 *         description: Successfully retrieved all flights
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "all flights fetched"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FlightResponse'
 *       404:
 *         description: No flights found
 */

flight_Router.get('/all', get_all_flights);
/**
 * @swagger
 * /flight/user:
 *   get:
 *     tags:
 *       - Flight
 *     summary: Get flights booked by authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user's flights
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "flights booked by id"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FlightResponse'
 *       404:
 *         description: No flights found for user
 */
flight_Router.get('/user',authmiddleware, get_flight_user_id);
/**
 * @swagger
 * /flight/quote/{quote_id}:
 *   get:
 *     tags:
 *       - Flight
 *     summary: Get flights by quote ID
 *     parameters:
 *       - in: path
 *         name: quote_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Quote ID to fetch flights for
 *         example: "64df36cbea5d1234abcd4568"
 *     responses:
 *       200:
 *         description: Successfully retrieved flights by quote
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "flight by quote fetched"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FlightResponse'
 *       400:
 *         description: Quote ID is required
 */

flight_Router.get('/quote/:quote_id', get_flight_quoto_id);
/**
 * @swagger
 * /flight/status/{status}:
 *   get:
 *     tags:
 *       - Flight
 *     summary: Get flights by status
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *         description: Status to filter flights by
 *         example: "confirmed"
 *     responses:
 *       200:
 *         description: Successfully retrieved flights by status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "all the flight with given status fetched"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FlightResponse'
 *       400:
 *         description: Status parameter is required
 */
flight_Router.get('/status/:status', get_flight_status);
/**
 * @swagger
 * /flight/operator/{id}:
 *   get:
 *     tags:
 *       - Flight
 *     summary: Get all flights booked for a specific operator
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Operator ID to fetch flights for
 *         example: "64df36cbea5d1234abcd4567"
 *     responses:
 *       200:
 *         description: Successfully retrieved flights for operator
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "successfully fetched flight booked for operator id"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Operator ID is required
 */

flight_Router.get('/operator/:id',get_all_flight_by_operator)
/**
 * @swagger
 * /flight/payment-status:
 *   put:
 *     tags:
 *       - Flight
 *     summary: Update flight after payment completion
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - payment_id
 *               - flight_id
 *             properties:
 *               payment_id:
 *                 type: string
 *                 example: "64ef32ffbc1a6789cdef1234"
 *               flight_id:
 *                 type: string
 *                 example: "64df36cbea5d1234abcd4567"
 *               party_addon:
 *                 $ref: '#/components/schemas/PartyAddon'
 *               transport_facility:
 *                 type: boolean
 *                 example: true
 *               food_service_addon:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/FoodServiceAddon'
 *     responses:
 *       200:
 *         description: Flight addons updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Flight addons updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     payment:
 *                       type: object
 *                     flight:
 *                       $ref: '#/components/schemas/FlightResponse'
 *       400:
 *         description: Payment not completed or invalid data
 *       404:
 *         description: Payment or Flight not found
 */
flight_Router.put('/payment-status', updation_after_payment);
/**
 * @swagger
 * /flight/payment-status:
 *   put:
 *     tags:
 *       - Flight
 *     summary: Update flight after payment completion
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - payment_id
 *               - flight_id
 *             properties:
 *               payment_id:
 *                 type: string
 *                 example: "64ef32ffbc1a6789cdef1234"
 *               flight_id:
 *                 type: string
 *                 example: "64df36cbea5d1234abcd4567"
 *               party_addon:
 *                 $ref: '#/components/schemas/PartyAddon'
 *               transport_facility:
 *                 type: boolean
 *                 example: true
 *               food_service_addon:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/FoodServiceAddon'
 *     responses:
 *       200:
 *         description: Flight addons updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Flight addons updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     payment:
 *                       type: object
 *                     flight:
 *                       $ref: '#/components/schemas/FlightResponse'
 *       400:
 *         description: Payment not completed or invalid data
 *       404:
 *         description: Payment or Flight not found
 */
flight_Router.put('/cancel/:id', cancel_flight);
/**
 * @swagger
 * /flight/addons/{flight_id}:
 *   put:
 *     tags:
 *       - Flight
 *     summary: Update flight addons and generate payment session
 *     parameters:
 *       - in: path
 *         name: flight_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Flight ID to update addons for
 *         example: "64df36cbea5d1234abcd4567"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               party_addon:
 *                 $ref: '#/components/schemas/PartyAddon'
 *               transport_facility:
 *                 type: boolean
 *                 example: true
 *               food_service_addon:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/FoodServiceAddon'
 *     responses:
 *       200:
 *         description: Payment session created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 order_id:
 *                   type: string
 *                   example: "ORDER_1640995200000"
 *                 session_id:
 *                   type: string
 *                   example: "session_abc123def456"
 *       400:
 *         description: Flight is not booked or invalid addon structure
 *       404:
 *         description: Flight not found
 *       500:
 *         description: Payment gateway error
 */

flight_Router.put('/addons/:id', update_flight_addons);
/**
 * @swagger
 * /flight/{id}:
 *   delete:
 *     tags:
 *       - Flight
 *     summary: Delete a flight booking
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Flight ID to delete
 *         example: "64df36cbea5d1234abcd4567"
 *     responses:
 *       200:
 *         description: Flight deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Flight deleted successfully"
 *                 data:
 *                   $ref: '#/components/schemas/FlightResponse'
 *       404:
 *         description: Flight not found
 */
flight_Router.delete('/:id', delete_flight);
export {flight_Router}

