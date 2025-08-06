import { Router } from "express";
import { get_details_all_airports,add_airports_details,delete_airport,update_airport_details,bulk_creation,get_airport_by_id } from "../../Controllers/airport_controller/airport_controller.js";
import { AdminBasedMiddleware } from "../../Middlewares/adminMiddleware.js";
import {authmiddleware} from "../../Middlewares/user_authentication_middleware.js"
const Airport_Router=Router()
/**
 * @swagger
 * /air_port/get_all_airport:
 *   post:
 *     tags:
 *       - Airports
 *     summary: Fetches all the airport
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Gets all the Airport associated with flying charters
 *       400:
 *         description: Missing required field
 *       500:
 *         description: Server Error
 */

Airport_Router.get("/get_all_airport",get_details_all_airports)
/**
 * @swagger
 * /air_port/add_airports:
 *   post:
 *     tags:
 *       - Airports
 *     summary: Add the detail of a specific airport
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: airport_id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the airport to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - airport_name
 *               - source_IATA
 *               - source_gps
 *               - source_lat
 *               - source_lon
 *               - classification
 *               - hour_of_operation
 *             properties:
 *               airport_name:
 *                 type: string
 *                 example: "Rajiv Gandhi Airport"
 *               source_IATA:
 *                 type: string
 *                 example: "HYD"
 *               source_gps:
 *                 type: string
 *                 example: "HPV"
 *               source_lat:
 *                 type: string
 *                 example: "34.34"
 *               source_lon:
 *                 type: string
 *                 example: "128.34"
 *               classification:
 *                 type: string
 *                 enum: ["Controlled", "UnControlled"]
 *                 example: "Controlled"
 *               hour_of_operation:
 *                 type: string
 *                 example: "H24"
 *     responses:
 *       200:
 *         description: Adds the details of the specific airport
 *       400:
 *         description: Missing required field
 *       500:
 *         description: Server Error
 */

Airport_Router.post("/add_airport",AdminBasedMiddleware,add_airports_details)
/**
 * @swagger
 * /air_port/update_airport/{airport_id}:
 *   patch:
 *     tags:
 *       - Airports
 *     summary: Update the detail of a specific airport
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: airport_id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the airport to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - airport_name
 *               - source_IATA
 *               - source_gps
 *               - source_lat
 *               - source_lon
 *               - classification
 *               - hour_of_operation
 *             properties:
 *               airport_name:
 *                 type: string
 *                 example: "Rajiv Gandhi Airport"
 *               source_IATA:
 *                 type: string
 *                 example: "HYD"
 *               source_gps:
 *                 type: string
 *                 example: "HPV"
 *               source_lat:
 *                 type: string
 *                 example: "34.34"
 *               source_lon:
 *                 type: string
 *                 example: "128.34"
 *               classification:
 *                 type: string
 *                 enum: ["Controlled", "UnControlled"]
 *                 example: "Controlled"
 *               hour_of_operation:
 *                 type: string
 *                 example: "H24"
 *     responses:
 *       200:
 *         description: Updates the details of the specific airport
 *       400:
 *         description: Missing required field
 *       500:
 *         description: Server Error
 */
Airport_Router.patch("/update_airport/:airport_id",authmiddleware,AdminBasedMiddleware,update_airport_details)
/**
 * @swagger
 * /air_port/delete_airport/{airport_id}:
 *   delete:
 *     tags:
 *       - Airports
 *     summary: Deletes the airport
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Delete the airport of specific id
 *       400:
 *         description: Missing required field
 *       500:
 *         description: Server Error
 */
Airport_Router.delete("/delete_airport/:airport_id",authmiddleware,AdminBasedMiddleware,delete_airport)

Airport_Router.post("/bulk",authmiddleware,AdminBasedMiddleware,bulk_creation)
export {Airport_Router}