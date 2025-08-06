import { z } from 'zod';
export const signupSchema = z.object({
    first_name: z.string().min(2, "First name must be at least 2 characters"),
    last_name: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    role:z.enum(["user","admin","broker","operator","coperate"],{
        required_error:"Role is required",
        invalid_type_error:"Invalid role"
    })
});

export const signinSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required")
});

export const verificationSchema = z.object({
    email: z.string().email("Invalid email address"),
    verify_code: z.string().min(1, "Verification code is required")
});
