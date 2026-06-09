  const { z } = require('zod');


const registerSchema = z.object({

    firstName: z
        .string()
        .min(2, 'First name must be at least 2 characters')
        .max(50, 'First name is too long')
        .trim(),

    lastName: z
        .string()
        .min(2, 'Last name must be at least 2 characters')
        .max(50, 'Last name is too long')
        .trim(),

    email: z
        .email('Invalid email address')
        .trim()
        .toLowerCase(),

    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
            'Password must contain uppercase, lowercase, number and special character'
        ),

    confirmPassword: z
        .string(),

    city: z
        .string()
        .min(2, 'City is required')
        .trim(),

    nationalId: z
    .string()
    .optional(),

    phone: z
        .string()
        .optional(),

    gender: z
        .enum(['male', 'female'])
        .optional(),

    dateOfBirth: z
        .string()
        .optional(),

    role: z
        .enum([
            'user',
            'driver',
            'placeOwner'
        ])
        .default('user'),

})
.refine(
    (data) => data.password === data.confirmPassword,
    {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    }
)
.refine(
    (data) => {
        if (data.role === 'driver') {
            return !!data.nationalId;
        }
        return true;
    },
    {
        message: 'National ID is required for drivers',
        path: ['nationalId'],
    }
);


// ========================================
// Login Validation
// ========================================

const loginSchema = z.object({

    email: z
        .email('Invalid email address'),

    password: z
        .string()
        .min(1, 'Password is required'),

});


// ========================================
// Verify OTP Validation
// ========================================

const verifyOTPSchema = z.object({

    email: z
        .email('Invalid email address'),

    otp: z
        .string()
        .length(6, 'OTP must be 6 digits'),

});


// ========================================
// Forgot Password Validation
// ========================================

const forgotPasswordSchema = z.object({

    email: z
        .email('Invalid email address'),

});


// ========================================
// Reset Password Validation
// ========================================

const resetPasswordSchema = z.object({

    email: z
        .email('Invalid email address'),

    otp: z
        .string()
        .length(6, 'OTP must be 6 digits'),

    newPassword: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
            'Password must contain uppercase, lowercase, number and special character'
        ),

    confirmPassword: z
        .string(),

})
.refine(

    (data) =>
        data.newPassword === data.confirmPassword,

    {

        message: 'Passwords do not match',

        path: ['confirmPassword'],

    }

);


// ========================================
// Exports
// ========================================

module.exports = {

    registerSchema,

    loginSchema,

    verifyOTPSchema,

    forgotPasswordSchema,

    resetPasswordSchema,

};