import Router from "express"
import { additional_addons, empty_leg_invoice } from "../../Controllers/invoice_controller/invoice_controller.js"

const Invoice_Router = Router()

/**
 * @swagger
 * /invoice/addon/{flight_id}/{payment_id}:
 *   get:
 *     tags:
 *       - Invoice
 *     summary: Generate PDF invoice with add-on services for regular flights
 *     description: Generates a PDF invoice for flight bookings with optional add-on services like transport, food, and party arrangements
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: flight_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Flight booking ID to generate invoice for
 *         example: "64df36cbea5d1234abcd4567"
 *       - in: path
 *         name: payment_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment ID associated with the flight booking
 *         example: "64ef32ffbc1a6789cdef1234"
 *     requestBody:
 *       required: false
 *       description: Optional add-on services to include in the invoice
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               transport_facility:
 *                 type: boolean
 *                 description: Whether to include transport facility service
 *                 example: true
 *               food_service_addon:
 *                 type: array
 *                 description: Food service add-ons for the flight
 *                 items:
 *                   type: object
 *                   properties:
 *                     food_type:
 *                       type: object
 *                       description: Food type pricing details
 *                       properties:
 *                         departure_way:
 *                           type: number
 *                           description: Price for departure food service
 *                           example: 1000
 *                         arrival_way:
 *                           type: number
 *                           description: Price for arrival food service
 *                           example: 1200
 *                     route:
 *                       type: string
 *                       enum: [departure, arrival, both]
 *                       description: Which route the food service applies to
 *                       example: "both"
 *               party_addon:
 *                 type: object
 *                 description: Party arrangement add-on
 *                 properties:
 *                   event_name:
 *                     type: string
 *                     enum: [Anniversary, Birthday]
 *                     description: Type of event celebration
 *                     example: "Anniversary"
 *                   route:
 *                     type: string
 *                     enum: [departure, arrival, both]
 *                     description: Which route the party service applies to
 *                     example: "both"
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
 *             schema:
 *               type: string
 *               example: application/pdf
 *           Content-Disposition:
 *             schema:
 *               type: string
 *               example: attachment; filename=addon-invoice.pdf
 *       400:
 *         description: Missing or invalid flight ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Flight id is required"
 *       404:
 *         description: Flight, payment, fleet, or airport data not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   examples:
 *                     flight_not_found:
 *                       value: "Flight or payment details not found"
 *                     fleet_not_found:
 *                       value: "Fleet not found"
 *                     airport_not_found:
 *                       value: "Departure or Arrival airport not found"
 *       500:
 *         description: Server error while generating invoice
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Error generating invoice"
 */
Invoice_Router.get('/addon/:flight_id/:payment_id', additional_addons)

/**
 * @swagger
 * /invoice/empty:
 *   post:
 *     tags:
 *       - Invoice
 *     summary: Generate PDF invoice for empty leg booking
 *     description: Generates a PDF invoice for empty leg seat bookings with comprehensive flight and pricing details
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - empty_booking_id
 *             properties:
 *               empty_booking_id:
 *                 type: string
 *                 description: Empty leg booking ID to generate invoice for
 *                 example: "64df36cbea5d1234abcd4567"
 *               payment_id:
 *                 type: string
 *                 description: Payment ID associated with the booking (optional)
 *                 example: "64ef32ffbc1a6789cdef1234"
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
 *             schema:
 *               type: string
 *               example: application/pdf
 *           Content-Disposition:
 *             schema:
 *               type: string
 *               example: attachment; filename=empty-leg-invoice.pdf
 *       400:
 *         description: Missing required empty_booking_id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "empty_booking_id is required"
 *       404:
 *         description: Empty booking or related data not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   examples:
 *                     booking_not_found:
 *                       value: "Empty booking not found"
 *                     leg_details_not_found:
 *                       value: "Empty leg details not found"
 *       500:
 *         description: Server error while generating invoice
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error generating invoice"
 *                 error:
 *                   type: string
 *                   example: "Template file not found"
 *                 stack:
 *                   type: string
 *                   description: Error stack trace (only in development mode)
 */
Invoice_Router.post('/empty', empty_leg_invoice)

export { Invoice_Router }