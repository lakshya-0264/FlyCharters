import { Router } from "express";
import {get_all_distance,getdistancebetweenairport,createDistance} from "../../Controllers/distance_controller/distance_controller.js"
import { authmiddleware } from "../../Middlewares/user_authentication_middleware.js";
const Distance_Router=Router()
/**
 * @swagger
 * /distance/create:
 *   post:
 *     tags:
 *       - Distances
 *     summary: Adds the distance between two airports
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - from
 *               - to
 *               - distance
 *             properties:
 *               from:
 *                 type: string
 *                 example: "DEL"
 *               to:
 *                 type: string
 *                 example: "BOM"
 *               distance:
 *                 type: number
 *                 example: 345
 *     responses:
 *       200:
 *         description: Gets all the airport distances associated with flying charters
 *       400:
 *         description: Missing required field
 *       500:
 *         description: Server error
 */
Distance_Router.post("/create",authmiddleware,createDistance)
/**
 * @swagger
 * /distance/all:
 *   get:
 *     tags:
 *       - Distances
 *     summary: Fetches all the distances between airport
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
 *         description: Gets all the Airport distances associated with flying charters
 *       400:
 *         description: Missing required field
 *       500:
 *         description: Server Error
 */
Distance_Router.get("/all",authmiddleware,get_all_distance)
/**
 * @swagger
 * /distance/between/{fromId}/{toId}:
 *   get:
 *     tags:
 *       - Distances
 *     summary: Fetches the distance between airport
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
 *         description: Gets all the Airport distances associated with flying charters
 *       400:
 *         description: Missing required field
 *       500:
 *         description: Server Error
 */
Distance_Router.get("/between/:fromId/:toId",authmiddleware,getdistancebetweenairport)
export {Distance_Router}