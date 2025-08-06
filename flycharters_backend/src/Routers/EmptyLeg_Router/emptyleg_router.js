import {Router} from "express"
import { suggest_empty_leg,add_empty_leg,get_all_empty_leg,get_all_empty_leg_by_operator,search_empty_leg,invoice_generation_empty} from "../../Controllers/empty_leg_controller/empty_leg_controller.js"
import { authmiddleware } from "../../Middlewares/user_authentication_middleware.js"
const Empty_Router=Router()
/**
 * @swagger
 * /empty/all:
 *   get:
 *     tags:
 *       - Empty Leg
 *     summary: Get all available empty leg flights
 *     responses:
 *       200:
 *         description: Successfully retrieved all empty leg flights
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
 *                   example: "all the empty leg fetched successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/EmptyLegResponse'
 *       400:
 *         description: Unable to fetch empty leg flights
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
 *                   example: "unable to fetch empty leg"
 */

Empty_Router.get("/all",get_all_empty_leg)
/**
 * @swagger
 * /empty/suggest/{flight_id}:
 *   get:
 *     tags:
 *       - Empty Leg
 *     summary: Generate empty leg suggestions based on existing flight
 *     parameters:
 *       - in: path
 *         name: flight_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Flight ID to generate empty leg suggestions for
 *         example: "64df36cbea5d1234abcd4567"
 *     responses:
 *       200:
 *         description: Empty leg suggestions generated successfully
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
 *                   example: "empty leg added successfully"
 *                 data:
 *                   oneOf:
 *                     - $ref: '#/components/schemas/EmptyLegSuggestion'
 *                     - type: object
 *                       properties:
 *                         empty_leg_obj1:
 *                           $ref: '#/components/schemas/EmptyLegSuggestion'
 *                         empty_leg_obj2:
 *                           $ref: '#/components/schemas/EmptyLegSuggestion'
 *       400:
 *         description: Flight ID is required
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
 *                   example: "flight_id is required"
 */

Empty_Router.get("/suggest/:flight_id",suggest_empty_leg)
/**
 * @swagger
 * /empty/add_flight:
 *   post:
 *     tags:
 *       - Empty Leg
 *     summary: Add a new empty leg flight
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - empty_leg_object
 *             properties:
 *               empty_leg_object:
 *                 $ref: '#/components/schemas/EmptyLegObject'
 *     responses:
 *       201:
 *         description: Empty leg created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 201
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "empty leg created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/EmptyLegResponse'
 *       400:
 *         description: Bad request - missing object or already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 400
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "empty leg object is required"
 *                 data:
 *                   type: object
 *                   example: {}
 *       500:
 *         description: Server error while creating empty leg
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 500
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "some error in creating the empty leg"
 */

Empty_Router.post("/add_flight",add_empty_leg)
/**
 * @swagger
 * /empty/operator:
 *   get:
 *     tags:
 *       - Empty Leg
 *     summary: Get all empty leg flights for authenticated operator
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved operator's empty leg flights
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
 *                   example: "all empty leg fetched successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       fleet_id:
 *                         type: string
 *                       takeOff_Airport:
 *                         type: string
 *                       destination_Airport:
 *                         type: string
 *                       departureDate:
 *                         type: string
 *                         format: date
 *                       departureTime:
 *                         type: string
 *                       arrivalDate:
 *                         type: string
 *                         format: date
 *                       arrivalTime:
 *                         type: string
 *                       price:
 *                         type: number
 *                       handling_fee:
 *                         type: number
 *                       Fleets:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           operatorId:
 *                             type: string
 *                           name:
 *                             type: string
 *                           capacity:
 *                             type: number
 *                           model:
 *                             type: string
 *       400:
 *         description: Unable to fetch empty leg flights
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
 *                   example: "unable to fetch empty leg"
 */

Empty_Router.get("/operator",authmiddleware,get_all_empty_leg_by_operator)
/**
 * @swagger
 * /empty/search:
 *   get:
 *     tags:
 *       - Empty Leg
 *     summary: Search empty leg flights by departure date
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - departureDate
 *             properties:
 *               departureDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-08-15"
 *                 description: "Date to search for empty leg flights"
 *     responses:
 *       200:
 *         description: Empty leg flights found for the specified date
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
 *                   example: "all the empty leg fetched succesfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/EmptyLegResponse'
 *       400:
 *         description: Bad request - missing departure date or unable to fetch
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
 *                   example: "departure date is required"
 */

Empty_Router.get("/search",search_empty_leg)
/**
 * @swagger
 * /empty/invoice/{empty_leg_id}:
 *   get:
 *     tags:
 *       - Empty Leg
 *     summary: Generate PDF invoice for empty leg booking
 *     parameters:
 *       - in: path
 *         name: empty_leg_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Empty leg booking ID to generate invoice for
 *         example: "64df36cbea5d1234abcd4567"
 *     responses:
 *       200:
 *         description: Successfully generated invoice PDF
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *         headers:
 *           Content-Type:
 *             description: PDF content type
 *             schema:
 *               type: string
 *               example: "application/pdf"
 *           Content-Disposition:
 *             description: Attachment filename
 *             schema:
 *               type: string
 *               example: "attachment; filename=invoice.pdf"
 *       400:
 *         description: Empty leg booking ID not found
 *       500:
 *         description: Server error while generating invoice
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
 *                   example: "Error generating invoice"
 */
Empty_Router.get("/invoice/:empty_leg_id",invoice_generation_empty)
export {Empty_Router}





