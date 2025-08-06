import { asynchandler } from "../Helpers/asynchandler.js";
import { ApiResponse } from "../Helpers/apiresponse.js";
import { option } from "../Helpers/option.js";
import { signupSchema, signinSchema, verificationSchema } from "../Helpers/validation_schemas/validation_schemas.js"
import User from "../Models/userModel.js";
import bcrypt from "bcryptjs"
import { token_Generation } from "../Helpers/token_generation.js";
import { emailverificationemail } from "../Helpers/email.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../Helpers/apierror.js";

export const SignupApi = asynchandler(async (req, res) => {
    const { error, data } = signupSchema.safeParse(req.body);
    if (error) {
        console.log(error.errors);
        throw new ApiError(400, "Validation Error", error.errors);
    }
    const { first_name, last_name, email, password, phone, role } = req.body;

    const existingUser = await User.findOne({
        $or: [{ email }, { phone }],
        isEmailVerified: true
    });

    if (existingUser) {
        throw new ApiError(400, "User already exists with this email or phone", [], false);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = token_Generation();
    const expirytime = new Date(Date.now() + 30 * 60 * 1000);

    const user = await User.create({
        firstName: first_name,
        lastName: last_name,
        email,
        passwordHash: hashedPassword,
        phone,
        role: role,
        verificationToken: token,
        verificationTokenExpiry: expirytime
    });

    if (!user) {
        throw new ApiError(500, "User creation failed", [], false);
    }

    await emailverificationemail(email, token);
    res.json(new ApiResponse(200, true, "user registered successfully verification code has been sent to your email"));
});

export const SigninApi = asynchandler(async (req, res) => {
    try {
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not set in environment variables');
            throw new ApiError(500, "Server configuration error");
        }

        console.log('Signin attempt with body:', req.body);

        const { error, data } = signinSchema.safeParse(req.body);
        if (error) {
            console.log('Validation error:', error.errors);
            throw new ApiError(400, "Validation Error", error.errors);
        }

        const { email, password } = data;

        const user = await User.findOne({ email });
        // console.log('User query result:', user);

        if (!user) {
            throw new ApiError(401, "Email doesn't exist!");
        }

        if (!user.isEmailVerified) {
            throw new ApiError(401, "Please! verify your email first");
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new ApiError(401, "Password doesn't match");
        }

        const token = jwt.sign(
            { _id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.cookie('Accesstoken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.json(new ApiResponse(200, true, "Login successful", {
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                createdAt: user.createdAt,
                role: user.role
            }
        }));

    } catch (error) {
        console.error('Signin error:', error);
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal server error", error.message);
    }
});

export const VerifyEmailApi = asynchandler(async (req, res) => {
    const { error, data } = verificationSchema.safeParse(req.body);
    if (error) {
        console.log('Validation error:', error.errors);
        throw new ApiError(400, "Validation Error", error.errors, false);
    }
    const { email, verify_code } = data;
    console.log('Verifying email:', email, 'with code:', verify_code);

    const user = await User.findOne({
        email,
        verificationToken: verify_code,
        isEmailVerified: false,
        verificationTokenExpiry: { $gt: new Date() }
    });

    if (!user) {
        const existingUser = await User.findOne({ email });
        if (existingUser?.isEmailVerified) {
            throw new ApiError(400, "Email is already verified");
        }
        throw new ApiError(400, "Invalid verification code or code has expired");
    }

    user.isEmailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();
    const token = jwt.sign(
        { _id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );

    res.cookie('Accesstoken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000
    });
    res.status(200).json({
        success: true,
        message: "User verification has been successfully completed",
        data: {
            user: {
                email: user.email,
                role: user.role
            }
        }
    });
});

export const ResendVerificationApi = asynchandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    const user = await User.findOne({
        email,
        isEmailVerified: false
    });

    if (!user) {
        throw new ApiError(400, "No unverified account found with this email");
    }

    const newToken = token_Generation();
    const newExpiry = new Date(Date.now() + 30 * 60 * 1000);

    user.verificationToken = newToken
    user.verificationTokenExpiry = newExpiry
    await user.save();
    await emailverificationemail(email, newToken);
    res.json(new ApiResponse(200, true, "New verification code has been sent to your email"));
});

export const logout = (req, res) => {
  res.clearCookie('Accesstoken', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });
  return res.status(200).json({ success: true, message: 'Logged out successfully' });
};

export const sessionVerification = (req, res) => {
    const { _id, email, firstName, lastName, role, phone, createdAt } = req.user;
    res.status(200).json({
        success: true,
        user: {
            id: _id,
            email,
            firstName,
            lastName,
            role,
            phone,
            createdAt
        }
    });
};