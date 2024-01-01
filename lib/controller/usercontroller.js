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
exports.getUserOrders = exports.deleteUser = exports.editUser = exports.getEditUser = exports.getUserByID = exports.getAllUsers = exports.getUserDashboard = exports.login = exports.signup = void 0;
const usermodel_1 = __importDefault(require("../models/usermodel"));
const ordermodel_1 = __importDefault(require("../models/ordermodel"));
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
                    .render('signup', {
                    currentPage: 'signup',
                    message: "Email is already in use, try another email",
                    successMessage: ''
                });
            }
            const newUser = yield usermodel_1.default.create({
                firstName,
                lastName,
                userID,
                email,
                password: hashedPassword,
                // passwordConfirm: hashedPassword,
                phoneNo,
                isAdmin,
            });
            if (!newUser) {
                return res.render('signup', {
                    currentPage: 'signup',
                    message: "Invalid details, account cannot be created",
                    successMessage: ''
                });
            }
            return res.render('signup', { currentPage: 'signup', message: "", successMessage: 'Your account has been successfully created, login' });
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const formattedErrors = error.errors.map((err) => (err.message));
                return res.render('signup', {
                    currentPage: "signup",
                    message: formattedErrors.join(''),
                    successMessage: ''
                });
            }
            else {
                console.error("Error creating user:", error);
                return res
                    .status(500)
                    .render('signup', { currentPage: 'signup', message: "Internal server error" });
            }
        }
    });
}
exports.signup = signup;
function login(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const validation = loginSchema.parse(req.body);
            const { email, password } = validation;
            // Find the user by email
            const user = yield usermodel_1.default.findOne({
                where: { email },
                attributes: ["isAdmin", "userID", "email", "password"],
            });
            if (!user) {
                return res.render('login', { message: "Invalid email, user does not exist", currentPage: 'login' });
            }
            // Compare the provided password with the hashed password in the database, If passwords match, the login is successful
            if (user &&
                bcryptjs_1.default.compareSync(password, user.dataValues.password)) {
                const secret = process.env.secret;
                // create secret token for authenticated users
                const token = jsonwebtoken_1.default.sign({ loginkey: user.dataValues.userID,
                    isAdmin: user.dataValues.isAdmin }, secret, { expiresIn: "1h" });
                res.cookie('token', token, { httpOnly: true, secure: true });
                if (user.dataValues.isAdmin === true) {
                    // res.json({ status: "WELCOME ADMIN", token: token})
                    res.redirect('/cakemania.ng/admin/dashboard');
                }
                else {
                    // res.json({ status: "user successfully logged in", token: token})
                    res.redirect('/cakemania.ng/users/profile');
                }
            }
            else {
                // If passwords don't match, return an error
                return res
                    .render('login', { message: "Incorrect password", currentPage: 'login' });
                // .json({ status: "failed", message: "Invalid password" });
            }
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const formattedErrors = error.errors.map((err) => (err.message));
                return res.render('login', {
                    currentPage: "login",
                    message: formattedErrors.join('')
                });
            }
            else {
                console.error("Error creating user:", error);
                return res
                    .status(500)
                    .render('login', { currentPage: 'login', message: "Internal server error" });
            }
        }
    });
}
exports.login = login;
function getUserDashboard(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userID = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userID;
            const user = yield usermodel_1.default.findAll({
                where: { userID: userID, isAdmin: false }, // Adjust the column name according to your database schema
            });
            // Fetch products by user ID
            const userOrders = yield ordermodel_1.default.findAll({
            // where: { userID: userID }, // Adjust the column name according to your database schema
            });
            // res.json({ status: "successful", message: "welcome customer"})
            res.render('users/user-dashboard', { user, userOrders, currentPage: "user-dashboard" });
        }
        catch (error) {
            res.status(500).json({ message: 'server error' });
        }
    });
}
exports.getUserDashboard = getUserDashboard;
;
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
            const user = yield usermodel_1.default.findByPk(req.params.id, {
                attributes: { exclude: ['password'] },
            });
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
function getEditUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield usermodel_1.default.findByPk(req.params.id, {
                attributes: { exclude: ['password'] },
            });
            if (user) {
                res.render('users/user-edit-profile', { user, currentPage: 'user-dashboard' });
            }
            else {
                res.render('users/user-edit-profile', { message: "user does not exist", currentPage: 'user-dashboard' });
            }
        }
        catch (error) {
            res.status(500).json({ message: 'server error' });
        }
    });
}
exports.getEditUser = getEditUser;
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
function getUserOrders(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userID = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userID;
            const user = yield usermodel_1.default.findAll({
                where: { userID: userID, isAdmin: false }, // Adjust the column name according to your database schema
            });
            console.log(user);
            // Fetch products by user ID
            const userOrders = yield ordermodel_1.default.findAll({
            // where: { userID: userID }, // Adjust the column name according to your database schema
            });
            // res.json({ status: "successful", message: "welcome customer"})
            res.render('users/user-orders', { user, userOrders, currentPage: "user-dashboard" });
        }
        catch (error) {
            res.status(500).json({ message: 'server error' });
        }
    });
}
exports.getUserOrders = getUserOrders;
;
