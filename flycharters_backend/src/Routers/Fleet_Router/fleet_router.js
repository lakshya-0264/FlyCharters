import { Router } from "express";
import {
  getAllFleets,
  getFleetbyId,
  getFleetsByOperator,
  Add_Fleet_Controller,
  Delete_Fleet_Controller,
  Update_Fleet_Controller,
  getAvailableFleetsForDate,
  invoice_generation,
  fleetsRequestingApproval,  // New function
  ApprovalRejection,         // New function
  getFleetStats              // New function
} from "../../Controllers/fleet_controller/fleet_controller.js";
import { authmiddleware } from "../../Middlewares/user_authentication_middleware.js";
import { upload } from "../../Middlewares/multerMiddleware.js";
import { UserBasedMiddleware } from "../../Middlewares/userMiddleware.js";

const FleetRouter = Router();

/**
 * @swagger
 * /fleet/allfleets:
 *   get:
 *     tags:
 *       - Fleet
 *     summary: Get all fleets with operator details
 *     responses:
 *       200:
 *         description: Successfully retrieved all fleets
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
 *                   example: "all the fleet fetched"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FleetModel'
 */
FleetRouter.get("/allfleets", getAllFleets);

/**
 * @swagger
 * /fleet/invoice:
 *   get:
 *     tags:
 *       - Fleet
 *     summary: Generate PDF invoice for flight booking
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
FleetRouter.get("/invoice", invoice_generation);

/**
 * @swagger
 * /fleet/fleetbyid/{fleetId}:
 *   get:
 *     tags:
 *       - Fleet
 *     summary: Get fleet details by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fleetId
 *         required: true
 *         schema:
 *           type: string
 *         description: Fleet ID to retrieve
 *         example: "64df36cbea5d1234abcd4567"
 *     responses:
 *       200:
 *         description: Successfully retrieved fleet details
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
 *                   example: "fleet fetched successfully"
 *                 data:
 *                   $ref: '#/components/schemas/FleetModel'
 *       404:
 *         description: Fleet not found
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
 *                   example: "Fleet not found"
 */
FleetRouter.get("/fleetbyid/:fleetId", authmiddleware, getFleetbyId);

/**
 * @swagger
 * /fleet/fleetoperator/{operator_id}:
 *   get:
 *     tags:
 *       - Fleet
 *     summary: Get all fleets belonging to a specific operator
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: operator_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Operator ID to filter fleets
 *         example: "64df36cbea5d1234abcd4568"
 *     responses:
 *       200:
 *         description: Successfully retrieved operator's fleets
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
 *                   example: "all fleets by operator"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FleetModel'
 *       400:
 *         description: Operator ID not provided
 *       404:
 *         description: No fleets found for this operator
 */
FleetRouter.get("/fleetoperator/:operator_id", authmiddleware, getFleetsByOperator);

/**
 * @swagger
 * /fleet/addfleet:
 *   post:
 *     tags:
 *       - Fleet
 *     summary: Add a new fleet to the system
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
 *               - capacity
 *               - model
 *               - description
 *               - eom
 *               - validityTill
 *               - status
 *               - aircraftRegn
 *               - auw
 *               - cruisingSpeed
 *               - cruisingLevel
 *               - aircraftBase
 *               - price_per_hour
 *               - isAbleToLandUncontrolled
 *               - isPerformanceLimited
 *               - isAbleToLandShortRunway
 *               - fleetImg
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Gulfstream G650"
 *               capacity:
 *                 type: number
 *                 example: 12
 *               model:
 *                 type: string
 *                 example: "G650ER"
 *               description:
 *                 type: string
 *                 example: "Luxury long-range business jet with premium amenities"
 *               eom:
 *                 type: string
 *                 format: date
 *                 example: "2020-01-15"
 *               validityTill:
 *                 type: string
 *                 format: date
 *                 example: "2025-12-31"
 *               status:
 *                 type: string
 *                 enum: [active, inactive, maintenance]
 *                 example: "active"
 *               aircraftRegn:
 *                 type: string
 *                 example: "VT-ABC123"
 *               auw:
 *                 type: number
 *                 example: 45000
 *               cruisingSpeed:
 *                 type: number
 *                 example: 850
 *               cruisingLevel:
 *                 type: number
 *                 example: 45000
 *               aircraftBase:
 *                 type: string
 *                 example: "64df36cbea5d1234abcd4569"
 *               price_per_hour:
 *                 type: number
 *                 example: 150000
 *               isAbleToLandUncontrolled:
 *                 type: boolean
 *                 example: true
 *               isPerformanceLimited:
 *                 type: boolean
 *                 example: false
 *               isAbleToLandShortRunway:
 *                 type: boolean
 *                 example: true
 *               fleetImg:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: "Fleet images (maximum 6 images)"
 *     responses:
 *       200:
 *         description: Fleet created successfully
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
 *                   example: "Fleet has been created"
 *                 data:
 *                   $ref: '#/components/schemas/FleetModel'
 *       400:
 *         description: Bad request - missing fields or validation errors
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
 *                   example: "Please fill all the fields"
 *       404:
 *         description: User not found or operator not verified
 */
FleetRouter.post("/addfleet", authmiddleware, upload.array("fleetImg", 6), Add_Fleet_Controller);

/**
 * @swagger
 * /fleet/deletefleet/{fleetId}:
 *   delete:
 *     tags:
 *       - Fleet
 *     summary: Delete a fleet by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fleetId
 *         required: true
 *         schema:
 *           type: string
 *         description: Fleet ID to delete
 *         example: "64df36cbea5d1234abcd4567"
 *     responses:
 *       200:
 *         description: Fleet deleted successfully
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
 *                   example: "fleet has been deleted"
 *       404:
 *         description: Fleet not found
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
 *                   example: "Fleet not found"
 */
FleetRouter.delete("/deletefleet/:fleetId", authmiddleware, Delete_Fleet_Controller);

/**
 * @swagger
 * /fleet/updatefleet/{fleetId}:
 *   patch:
 *     tags:
 *       - Fleet
 *     summary: Update an existing fleet
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fleetId
 *         required: true
 *         schema:
 *           type: string
 *         description: Fleet ID to update
 *         example: "64df36cbea5d1234abcd4567"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Gulfstream G650"
 *               capacity:
 *                 type: number
 *                 example: 12
 *               model:
 *                 type: string
 *                 example: "G650ER"
 *               description:
 *                 type: string
 *                 example: "Luxury long-range business jet with premium amenities"
 *               eom:
 *                 type: string
 *                 format: date
 *                 example: "2020-01-15"
 *               validityTill:
 *                 type: string
 *                 format: date
 *                 example: "2025-12-31"
 *               status:
 *                 type: string
 *                 enum: [active, inactive, maintenance]
 *                 example: "active"
 *               aircraftRegn:
 *                 type: string
 *                 example: "VT-ABC123"
 *               auw:
 *                 type: number
 *                 example: 45000
 *               cruisingSpeed:
 *                 type: number
 *                 example: 850
 *               cruisingLevel:
 *                 type: number
 *                 example: 45000
 *               aircraftBase:
 *                 type: string
 *                 example: "64df36cbea5d1234abcd4569"
 *               price_per_hour:
 *                 type: number
 *                 example: 150000
 *               isAbleToLandUncontrolled:
 *                 type: boolean
 *                 example: true
 *               isPerformanceLimited:
 *                 type: boolean
 *                 example: false
 *               isAbleToLandShortRunway:
 *                 type: boolean
 *                 example: true
 *               fleetImg:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: "Fleet images (maximum 6 images)"
 *     responses:
 *       200:
 *         description: Fleet updated successfully
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
 *                   example: "Fleet has been updated"
 *                 data:
 *                   $ref: '#/components/schemas/FleetModel'
 *       404:
 *         description: Fleet not found
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
 *                   example: "Fleet not found"
 */
FleetRouter.patch("/updatefleet/:fleetId", authmiddleware, upload.array("fleetImg", 6), Update_Fleet_Controller);

/**
 * @swagger
 * /fleet/availablefleet:
 *   post:
 *     tags:
 *       - Fleet
 *     summary: Get available fleets for specific date and route
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AvailableFleetRequest'
 *     responses:
 *       200:
 *         description: Available fleets retrieved successfully
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
 *                   example: "all the flights one way fetched"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FleetCompleteDetails'
 *       400:
 *         description: Bad request - missing required fields
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
 *                   example: "departureDate is required"
 */
FleetRouter.post("/availablefleet", authmiddleware, getAvailableFleetsForDate);

/**
 * @swagger
 * /fleet/fleetsRequestingApproval:
 *   get:
 *     tags:
 *       - Fleet Admin
 *     summary: Get all fleets requesting approval
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved fleets requesting approval
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
 *                   example: "Fleets requesting approval fetched successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FleetModel'
 *       403:
 *         description: Unauthorized - Admin access required
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
 *                   example: "Access denied"
 */
FleetRouter.get("/fleetsRequestingApproval", authmiddleware, fleetsRequestingApproval);

/**
 * @swagger
 * /fleet/ApprovalRejection/{fleetId}:
 *   patch:
 *     tags:
 *       - Fleet Admin
 *     summary: Approve or reject a fleet
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fleetId
 *         required: true
 *         schema:
 *           type: string
 *         description: Fleet ID to approve or reject
 *         example: "64df36cbea5d1234abcd4567"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [approved, rejected]
 *                 example: "approved"
 *               rejectionReason:
 *                 type: string
 *                 example: "Missing required documentation"
 *                 description: "Required when status is 'rejected'"
 *     responses:
 *       200:
 *         description: Fleet status updated successfully
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
 *                   example: "Fleet approved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/FleetModel'
 *       400:
 *         description: Bad request - invalid status or missing rejection reason
 *       403:
 *         description: Unauthorized - Admin access required
 *       404:
 *         description: Fleet not found
 */
FleetRouter.patch("/ApprovalRejection/:fleetId", authmiddleware, ApprovalRejection);

/**
 * @swagger
 * /fleet/fleetStats:
 *   get:
 *     tags:
 *       - Fleet Admin
 *     summary: Get fleet statistics and analytics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved fleet statistics
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
 *                   example: "Fleet statistics retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalFleets:
 *                       type: number
 *                       example: 150
 *                     activeFleets:
 *                       type: number
 *                       example: 120
 *                     inactiveFleets:
 *                       type: number
 *                       example: 20
 *                     maintenanceFleets:
 *                       type: number
 *                       example: 10
 *                     pendingApproval:
 *                       type: number
 *                       example: 5
 *                     approvedFleets:
 *                       type: number
 *                       example: 140
 *                     rejectedFleets:
 *                       type: number
 *                       example: 5
 *                     fleetsByOperator:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           operatorId:
 *                             type: string
 *                           operatorName:
 *                             type: string
 *                           fleetCount:
 *                             type: number
 *       403:
 *         description: Unauthorized - Admin access required
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
 *                   example: "Access denied"
 */
FleetRouter.get("/fleetStats", authmiddleware, getFleetStats);

export { FleetRouter };