import { Router } from "express";
import { get_all_quota, get_quota_by_operator_id } from "../../Controllers/quote_controller/quote_controller.js"
import { authmiddleware } from "../../Middlewares/user_authentication_middleware.js";
import { AdminBasedMiddleware } from "../../Middlewares/adminMiddleware.js";
const Quote_Router = Router()
/**
 * @swagger
 * /qu/qut/all:
 *   get:
 *     tags:
 *       - Quotes
 *     summary: gets all the generated quotas
 *     security:
 *            - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *     responses:
 *       200:
 *         description: fetches the all the details of quotes generated so far
 *       400:
 *         description: Missing required field
 *       500:
 *         description: Server Error
 */
Quote_Router.get("/qut/all", authmiddleware, get_all_quota)
/**
 * @swagger
 * /qu/qut/operator:
 *   get:
 *     tags:
 *       - Quotes
 *     summary: gets all the generated quotas of an operator
 *     security:
 *            - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *     responses:
 *       200:
 *         description: Fetches all the details of quotos by operator
 *       400:
 *         description: Missing required field
 *       500:
 *         description: Server Error
 */
Quote_Router.get("/qut/operator", authmiddleware, get_quota_by_operator_id)
export { Quote_Router }