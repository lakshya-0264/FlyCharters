import { Router } from "express";
import {
    createOperator,
    verify_document,
    getAllOperators,
    getOperatorbyId,
    deleteOperator,
    reject_document,
    getOperator_login_user,
    getOptDetailsByOperator,
    getPendingVerifications,
    getVerifiedOperators,
    getRejectedOperators,
    getOperatorStats,
    bulkVerifyOperators,
    searchOperators
} from "../../Controllers/operator_controller/operator.controller.js"

import { createCapabilities } from '../../Controllers/aircraft_controller/aircraft_controller.js'
import { authmiddleware } from "../../Middlewares/user_authentication_middleware.js";
import { OperatorBasedMiddleware } from "../../Middlewares/operatormiddleware.js";
import { AdminBasedMiddleware } from "../../Middlewares/adminMiddleware.js";
import { upload } from "../../Middlewares/multerMiddleware.js";

const Operator_Router = Router();

/**
 * @swagger
 * /ope/alloperator:
 *   get:
 *     tags:
 *       - Operator
 *     summary: Get all operators
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All operators fetched successfully
 *       400:
 *         description: Operators not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server Error
 */
Operator_Router.get('/alloperator', authmiddleware, AdminBasedMiddleware, getAllOperators);

/**
 * @swagger
 * /ope/operatorbyid/{operator_id}:
 *   get:
 *     tags:
 *       - Operator
 *     summary: Get operator by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: operator_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Operator ID
 *     responses:
 *       200:
 *         description: Operator fetched successfully
 *       400:
 *         description: Operator not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server Error
 */
Operator_Router.get('/operatorbyid/:operator_id', authmiddleware, getOperatorbyId);

/**
 * @swagger
 * /ope/getOperatorByOperator/{operator_id}:
 *   get:
 *     tags:
 *       - Operator
 *     summary: Get operator details by operator ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: operator_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Operator ID
 *     responses:
 *       200:
 *         description: Document of operator fetched successfully
 *       400:
 *         description: Operator_id not found
 *       404:
 *         description: No document found for this operator
 *       500:
 *         description: Server Error
 */
Operator_Router.get("/getOperatorByOperator/:operator_id", authmiddleware, getOptDetailsByOperator);

/**
 * @swagger
 * /ope/create_op:
 *   post:
 *     tags:
 *       - Operator
 *     summary: Create a new operator
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - pointOfContact
 *               - location
 *               - aopNo
 *               - aopValidity
 *               - numAircraft
 *               - nsopBase
 *               - company_name
 *               - documents
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               pointOfContact:
 *                 type: string
 *                 example: +1234567890
 *               location:
 *                 type: string
 *                 example: New York
 *               aopNo:
 *                 type: string
 *                 example: AOP123456
 *               aopValidity:
 *                 type: string
 *                 example: 2025-12-31
 *               numAircraft:
 *                 type: number
 *                 example: 5
 *               nsopBase:
 *                 type: string
 *                 example: Base Location
 *               company_name:
 *                 type: string
 *                 example: Aviation Company Ltd
 *               documents:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 maxItems: 2
 *     responses:
 *       200:
 *         description: Operator created successfully
 *       400:
 *         description: Missing required fields or documents
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server Error
 */
Operator_Router.post('/create_op', authmiddleware, OperatorBasedMiddleware, upload.array('documents', 2), createOperator);

/**
 * @swagger
 * /ope/verify/{operator_id}:
 *   patch:
 *     tags:
 *       - Operator
 *     summary: Verify operator documents
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: operator_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Operator ID
 *     responses:
 *       200:
 *         description: Document verification process is done
 *       400:
 *         description: Operator not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Error while verifying the updation
 */
Operator_Router.patch('/verify/:operator_id', authmiddleware, AdminBasedMiddleware, verify_document);

/**
 * @swagger
 * /ope/reject/{operator_id}:
 *   patch:
 *     tags:
 *       - Operator
 *     summary: Reject operator documents
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: operator_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Operator ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rejection_reason
 *             properties:
 *               rejection_reason:
 *                 type: string
 *                 example: Documents are not clear or incomplete
 *     responses:
 *       200:
 *         description: Document rejected successfully
 *       400:
 *         description: Operator not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Rejection error is missing or error while rejecting
 */
Operator_Router.patch('/reject/:operator_id', authmiddleware, AdminBasedMiddleware, reject_document);

/**
 * @swagger
 * /ope/delete/{operator_id}:
 *   delete:
 *     tags:
 *       - Operator
 *     summary: Delete an operator
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: operator_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Operator ID
 *     responses:
 *       200:
 *         description: Operator deleted successfully
 *       400:
 *         description: Operator not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server Error
 */
Operator_Router.delete('/delete/:operator_id', authmiddleware, AdminBasedMiddleware, deleteOperator);

/**
 * @swagger
 * /ope/get_operator_login:
 *   get:
 *     tags:
 *       - Operator
 *     summary: Get operator details for logged in user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Operator fetched successfully
 *       400:
 *         description: Failed to fetch operator id
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server Error
 */
Operator_Router.get("/get_operator_login", authmiddleware, getOperator_login_user);

// Admin Dashboard Routes
/**
 * @swagger
 * /ope/pendingVerifications:
 *   get:
 *     tags:
 *       - Admin Dashboard
 *     summary: Get pending operator verifications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pending verifications fetched successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server Error
 */
Operator_Router.get('/pendingVerifications', authmiddleware, AdminBasedMiddleware, getPendingVerifications);

/**
 * @swagger
 * /ope/verifiedOperators:
 *   get:
 *     tags:
 *       - Admin Dashboard
 *     summary: Get verified operators
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Verified operators fetched successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server Error
 */
Operator_Router.get('/verifiedOperators', authmiddleware, AdminBasedMiddleware, getVerifiedOperators);

/**
 * @swagger
 * /ope/rejectedOperators:
 *   get:
 *     tags:
 *       - Admin Dashboard
 *     summary: Get rejected operators
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Rejected operators fetched successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server Error
 */
Operator_Router.get('/rejectedOperators', authmiddleware, AdminBasedMiddleware, getRejectedOperators);

/**
 * @swagger
 * /ope/stats:
 *   get:
 *     tags:
 *       - Admin Dashboard
 *     summary: Get operator statistics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Operator statistics fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: number
 *                 verified:
 *                   type: number
 *                 pending:
 *                   type: number
 *                 rejected:
 *                   type: number
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server Error
 */
Operator_Router.get('/stats', authmiddleware, AdminBasedMiddleware, getOperatorStats);

/**
 * @swagger
 * /ope/bulkVerify:
 *   post:
 *     tags:
 *       - Admin Dashboard
 *     summary: Bulk verify operators
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - operator_ids
 *             properties:
 *               operator_ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["60d5ecb54b24a12d8c8b4567", "60d5ecb54b24a12d8c8b4568"]
 *     responses:
 *       200:
 *         description: Operators verified successfully
 *       400:
 *         description: Operator IDs array is required
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server Error
 */
Operator_Router.post('/bulkVerify', authmiddleware, AdminBasedMiddleware, bulkVerifyOperators);

/**
 * @swagger
 * /ope/search:
 *   get:
 *     tags:
 *       - Admin Dashboard
 *     summary: Search operators
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Search query (name, location, aopNo)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [verified, pending, rejected]
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: Search results fetched successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server Error
 */
Operator_Router.get('/search', authmiddleware, AdminBasedMiddleware, searchOperators);

/**
 * @swagger
 * /ope/CreateCapabilities:
 *   post:
 *     tags:
 *       - Aircraft
 *     summary: Create aircraft capabilities
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             # Add properties based on your aircraft capabilities schema
 *     responses:
 *       200:
 *         description: Capabilities created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server Error
 */
Operator_Router.post("/CreateCapabilities", authmiddleware, createCapabilities);

export { Operator_Router };