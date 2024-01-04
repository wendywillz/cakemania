"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationSchemas = void 0;
const zod_1 = require("zod");
//new signupSchema
const signupSchema = zod_1.z.object({
    firstName: zod_1.z
        .string({
        required_error: "First Name is required",
        invalid_type_error: "only strings allowed for First Name",
    })
        .trim()
        .min(2, "minimum of 2 characters required")
        .max(50, "maximum of 50 characters required"),
    lastName: zod_1.z
        .string({
        required_error: "Last Name is required",
        invalid_type_error: "only strings allowed for Last Name",
    })
        .trim()
        .min(2, "minimum of 2 characters required")
        .max(50, "maximum of 50 characters required"),
    userID: zod_1.z.string().nullable().optional(),
    email: zod_1.z
        .string({
        required_error: "email is required",
        invalid_type_error: "email needs to be a string",
    })
        .email(),
    password: zod_1.z
        .string({
        required_error: "password is required",
        invalid_type_error: "password needs to be a string",
    })
        .min(8, "password must be at least 8 characters")
        .max(50, "Password must be at most 50 characters long")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]+$/, "Password must contain at least one lowercase letter, one uppercase letter, and one number"),
    passwordConfirm: zod_1.z.string(),
    phoneNo: zod_1.z
        .string({
        required_error: "phone number is required",
        invalid_type_error: "phone number needs to be a string",
    })
        .min(13, "input phone number in 234 format")
        .max(13),
    address: zod_1.z
        .string({
        required_error: "address is required",
        invalid_type_error: "only strings accepted",
    })
        .min(10)
        .max(150).optional(),
    lga: zod_1.z.string({
        required_error: "lga is required",
        invalid_type_error: "lga must be a string",
    }).optional(),
    state: zod_1.z.string({
        required_error: "state is required",
        invalid_type_error: "state must be a string",
    }).optional(),
    isAdmin: zod_1.z.boolean().default(false),
})
    .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
const loginSchema = zod_1.z.object({
    email: zod_1.z
        .string({
        required_error: "email is required",
        invalid_type_error: "email needs to be a string",
    })
        .email(),
    password: zod_1.z
        .string({
        required_error: "password is required",
        invalid_type_error: "password needs to be a string",
    })
        .min(8, "password must be at least 8 characters")
        .max(50, "Password must be at most 50 characters long")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]+$/, "Password must contain at least one lowercase letter, one uppercase letter, and one number"),
});
const cakeSchema = zod_1.z.object({
    cakeName: zod_1.z.string({
        required_error: "cake name is required",
        invalid_type_error: "name needs to be a string",
    })
        .trim()
        .max(50, "Cake name should not excede 50 characters"),
    category: zod_1.z.string({
        required_error: "category is required",
        invalid_type_error: "category needs to be a number",
    }),
    description: zod_1.z.string().nullable(),
    image: zod_1.z.string({
        required_error: "cake image is required",
        invalid_type_error: "image needs to be a url string",
    }).url(),
    flavour: zod_1.z.string({
        required_error: "category is required",
        invalid_type_error: "category needs to be a string",
    }),
    price: zod_1.z.string({
        required_error: "price is required",
        invalid_type_error: "price needs to be a string",
    }).trim(),
    // price: z.string().refine(value => {
    //     const numberValue = Number(value);
    //     return (
    //       !isNaN(numberValue) &&
    //       numberValue >= 0 &&
    //       numberValue <= 1000000 &&
    //       numberValue.toFixed(2) === value
    //     );
    //   }, 'Invalid decimal precision or numeric range'),
    cakeID: zod_1.z.string().nullable().optional(),
    // userID: z.string().nullable().optional(),
    rating: zod_1.z.number().min(1).max(5, 'rating cannot exceed 5').nullable().optional(),
    comments: zod_1.z.string().min(10).nullable().optional(),
    numReviews: zod_1.z.number().nullable().optional()
});
const categorySchema = zod_1.z.object({
    categoryName: zod_1.z.string({
        required_error: "name is required",
        invalid_type_error: "name needs to be a string",
    }).max(50),
    categoryID: zod_1.z.number().nullable().optional()
    //   categoryImage: z.string({
    //     required_error: "cake image is required",
    //     invalid_type_error: "image needs to be a url string",
    // }).url()
});
const orderItemsSchema = zod_1.z.object({
    itemName: zod_1.z.string(),
    size: zod_1.z.string(),
    quantity: zod_1.z.string(),
    price: zod_1.z.number(),
});
const orderSchema = zod_1.z.object({
    orderID: zod_1.z.number(),
    total: zod_1.z.number(),
    status: zod_1.z.string(),
    deliveryPhoneNo: zod_1.z.string(),
    deliveryAddress: zod_1.z.string(),
    deliveryState: zod_1.z.string(),
    deliveryLga: zod_1.z.string(),
    additionalInfo: zod_1.z.string().nullable(),
});
exports.validationSchemas = { signupSchema, loginSchema, cakeSchema, categorySchema, orderItemsSchema, orderSchema };
