"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.editUser = exports.getUserByID = exports.getAllUsers = exports.login = exports.signup = void 0;
const usermodel_1 = __importDefault(require("../models/usermodel"));
const zod_1 = require("zod");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validate_1 = require("../validation/validate");
const { signupSchema, loginSchema, cakeSchema, categorySchema, orderItemsSchema, orderSchema, } = validate_1.validationSchemas;
function signup(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const validation = signupSchema.parse(req.body);
            const { firstName, userID, lastName, email, password, passwordConfirm, phoneNo, isAdmin, } = validation;
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            //check if user already exists by checking to see if the email exists in our database already
            const existingUser = yield usermodel_1.default.findOne({ where: { email } });
            if (existingUser) {
                return res
                    .status(400)
                    .json({
                    status: "failed",
                    message: "Email is already in use, try another email",
                });
            }
            const newUser = yield usermodel_1.default.create({
                firstName,
                lastName,
                userID,
                email,
                password: hashedPassword,
                passwordConfirm: hashedPassword,
                phoneNo,
                isAdmin,
            });
            if (!newUser) {
                return res.status(400).json({
                    status: "failed",
                    message: "Invalid details, account cannot be created",
                });
            }
            return res.status(200).json({ status: "account created", user: newUser });
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const formattedErrors = error.errors.map((err) => ({
                    path: err.path.join("."),
                    message: err.message,
                }));
                return res.status(400).json({
                    status: "failed",
                    message: "Validation errors",
                    errors: formattedErrors,
                });
            }
            else {
                console.error("Error creating user:", error);
                return res
                    .status(500)
                    .json({ status: "error", message: "Internal server error" });
            }
        }
    });
}
exports.signup = signup;
function login(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const validation = loginSchema.parse(req.body);
        const { email, password } = validation;
        try {
            // Find the user by email
            const user = yield usermodel_1.default.findOne({
                where: { email },
                attributes: ["isAdmin", "userID", "email", "password"],
            });
            // If the user is not found, return an error
            if (!user) {
                return res.json({ status: "failed, user does not exist" });
                // .json({ status: "failed", message: "User not found" });
            }
            // Compare the provided password with the hashed password in the database, If passwords match, the login is successful
            if (user &&
                bcryptjs_1.default.compareSync(password, user.dataValues.password)) {
                const secret = process.env.secret;
                // create secret token for authenticated users
                const token = jsonwebtoken_1.default.sign({ loginkey: user.dataValues.userID, }, secret, { expiresIn: "1h" });
                res.cookie('token', token, { httpOnly: true, secure: true });
                if (user.dataValues.isAdmin === true) {
                    res.json({ status: "WELCOME ADMIN", token: token });
                }
                else {
                    res.json({ status: "user successfully logged in", token: token });
                }
                // res.status(200).redirect('/store/products/myprofile')
            }
            else {
                // If passwords don't match, return an error
                return res
                    .status(401)
                    .json({ status: "failed", message: "Invalid password" });
            }
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const formattedErrors = error.errors.map((err) => ({
                    path: err.path.join("."),
                    message: err.message,
                }));
                return res.status(400).json({
                    status: "failed",
                    message: "Validation errors",
                    errors: formattedErrors,
                });
            }
            else {
                console.error("Error logging in:", error);
                return res
                    .status(500)
                    .json({ status: "error", message: "Internal server error" });
            }
        }
    });
}
exports.login = login;
function getAllUsers(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield usermodel_1.default.findAll({
                attributes: {
                    exclude: ['password', 'passwordConfirm'] // Exclude the 'password' column from the result
                }
            });
            res.status(200).json(users);
        }
        catch (error) {
            res.status(500).json({ message: 'server error' });
        }
    });
}
exports.getAllUsers = getAllUsers;
;
function getUserByID(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield usermodel_1.default.findByPk(req.params.id);
            if (user) {
                res.status(200).json(user);
            }
            else {
                res.status(404).json({ message: 'User not found' });
            }
        }
        catch (error) {
            res.status(500).json({ message: 'server error' });
        }
    });
}
exports.getUserByID = getUserByID;
;
function editUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield usermodel_1.default.findByPk(req.params.id);
            if (user) {
                yield user.update(req.body);
                res.status(200).json({ status: "user edited successfully", user });
            }
            else {
                res.status(404).json({ message: 'User not found' });
            }
        }
        catch (error) {
            res.status(500).json({ message: 'server error' });
        }
    });
}
exports.editUser = editUser;
;
function deleteUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield usermodel_1.default.findByPk(req.params.id);
            if (user) {
                yield user.destroy();
                res.status(200).json({ status: "success", message: 'User deleted' });
            }
            else {
                res.status(404).json({ message: 'User not found' });
            }
        }
        catch (error) {
            res.status(500).json({ message: 'server error' });
        }
    });
}
exports.deleteUser = deleteUser;
;
// if (error instanceof ZodError) {
//     const zodErrorMessage = error.issues.map((issue) => issue.message);
//     res.render("signup", { zodError: zodErrorMessage });
//     res.json({ zodError: zodErrorMessage })
//   } else if (error) {
//     console.error("Error creating user:", error);
//     return res
//       .status(500)
//       .json({ status: "error", message: "Internal server error" });
//   }
