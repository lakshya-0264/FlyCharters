import { Router } from "express";
const Payment_Router=Router()
import { create_order,payment_status,get_all_payment,updation_after_payment} from "../../Controllers/payment_controller/payment_controller.js";
/**
 * @swagger
 * /pay/order/:flight_id:
 *   post:
 *     tags:
 *       - Payment
 *     summary: Create a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 example: johndoe@mail.com
 *               password:
 *                 type: string
 *                 example: johnDoe20!@
 *     responses:
 *       200:
 *         description: User is created but not verified
 *       400:
 *         description: Missing required field
 *       500:
 *         description: Server Error
 */
Payment_Router.post("/order/:flight_id",create_order)
/**
 * @swagger
 * /pay/payment-status:
 *   get:
 *     tags:
 *       - Payment
 *     summary: Create a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 example: johndoe@mail.com
 *               password:
 *                 type: string
 *                 example: johnDoe20!@
 *     responses:
 *       200:
 *         description: User is created but not verified
 *       400:
 *         description: Missing required field
 *       500:
 *         description: Server Error
 */
Payment_Router.get("/payment-status",payment_status)
/**
 * @swagger
 * /pay/all_payment:
 *   get:
 *     tags:
 *       - Payment
 *     summary: Create a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 example: johndoe@mail.com
 *               password:
 *                 type: string
 *                 example: johnDoe20!@
 *     responses:
 *       200:
 *         description: User is created but not verified
 *       400:
 *         description: Missing required field
 *       500:
 *         description: Server Error
 */
Payment_Router.get("/all_payment",get_all_payment)
/**
 * @swagger
 * /pay/final_book/:payment_id/:flight_id:
 *   post:
 *     tags:
 *       - Payment
 *     summary: Create a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 example: johndoe@mail.com
 *               password:
 *                 type: string
 *                 example: johnDoe20!@
 *     responses:
 *       200:
 *         description: User is created but not verified
 *       400:
 *         description: Missing required field
 *       500:
 *         description: Server Error
 */
Payment_Router.post("/final_book/:payment_id/:flight_id",updation_after_payment)
export {Payment_Router}