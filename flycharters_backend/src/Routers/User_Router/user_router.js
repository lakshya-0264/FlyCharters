import { Router } from "express";
import { SignupApi, VerifyEmailApi, SigninApi, ResendVerificationApi, logout, sessionVerification } from "../../Controllers/user_controller.js";
import { authmiddleware } from "../../Middlewares/user_authentication_middleware.js";
const authRouter = Router();
/**
 * @swagger
 * /auth/signup:
 *   post:
 *     tags:
 *       - Authentication
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
 *               firstname:
 *                 type: string
 *                 example: johndoe
 *               lastname:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 example: johndoe@mail.com
 *               password:
 *                 type: string
 *                 example: johnDoe20!@
 *               phone:
 *                 type: string
 *                 example: 9137382083
 *               role:
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
authRouter.post('/signup', SignupApi);
/**
 * @swagger
 * /auth/verify:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Verify the  user
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
 *               email:
 *                 type: string
 *                 example: johndoe@mail.com
 *               verify_code:
 *                 type: string
 *                 example: VBGS135
 *     responses:
 *       200:
 *         description: User is verified
 *       400:
 *         description: Missing required field
 *       500:
 *         description: Server Error
 */
authRouter.post('/verify', VerifyEmailApi);
/**
 * @swagger
 * /auth/signin:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Signing of User
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
 *               email:
 *                 type: string
 *                 example: johndoe@mail.com
 *               password:
 *                 type: string
 *                 example: johnDoe20!@
 *     responses:
 *       200:
 *         description: User gets logged in
 *       400:
 *         description: Missing required field
 *       500:
 *         description: Server Error
 */
authRouter.post('/signin', SigninApi);
/**
 * @swagger
 * /auth/resend-verification:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Resend the verification token
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
 *               email:
 *                 type: string
 *                 example: johndoe@mail.com
 *     responses:
 *       200:
 *         description: Verification code is resend
 *       400:
 *         description: Missing required field
 *       500:
 *         description: Server Error
 */
authRouter.post('/resend-verification', ResendVerificationApi);
/**
 * @swagger
 * /auth/me:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Get current logged-in user's information
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User session verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *       400:
 *         description: Unauthorized Request or invalid access token
 *       500:
 *         description: Internal Server Error
 */

authRouter.get('/me', authmiddleware, sessionVerification);
/**
 * @swagger
 * /auth/logout:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Logouts the current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User session verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *       400:
 *         description: Unauthorized Request or invalid access token
 *       500:
 *         description: Internal Server Error
 */
authRouter.post('/logout', logout);
export { authRouter };
