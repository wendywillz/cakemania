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
exports.deleteCake = exports.updateCake = exports.getUpdateCake = exports.createCake = exports.getAdminCategories = exports.getAdminCakes = exports.getAdminDashboard = void 0;
const usermodel_1 = __importDefault(require("../models/usermodel"));
const cakemodel_1 = __importDefault(require("../models/cakemodel"));
const categorymodel_1 = __importDefault(require("../models/categorymodel"));
const validate_1 = require("../validation/validate");
const zod_1 = require("zod");
const { cakeSchema } = validate_1.validationSchemas;
function getAdminDashboard(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Assuming you have user information available in req.user after authentication
            const userID = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userID;
            const categories = yield categorymodel_1.default.findAll();
            const admin = yield usermodel_1.default.findAll({
                where: { userID: userID, isAdmin: true },
                // Adjust the column name according to your database schema
            });
            // Fetch products by user ID
            const adminCakes = yield cakemodel_1.default.findAll({
                where: { userID: userID },
            });
            const adminCategories = yield categorymodel_1.default.findAll({
                where: {
                    categoryID: adminCakes.map(cake => cake.dataValues.category),
                },
            });
            // Render the products page with the fetched data
            res.render('admin/index', { categories, admin, adminCakes, adminCategories });
        }
        catch (error) {
            // Handle errors appropriately
            res.status(500).send('Internal Server Error');
        }
    });
}
exports.getAdminDashboard = getAdminDashboard;
function getAdminCakes(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Assuming you have user information available in req.user after authentication
            const userID = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userID;
            const admin = yield usermodel_1.default.findAll({
                where: { userID: userID, isAdmin: true }, // Adjust the column name according to your database schema
            });
            // Fetch products by user ID
            const adminCakes = yield cakemodel_1.default.findAll({
                where: { userID: userID }, // Adjust the column name according to your database schema
            });
            // Render the products page with the fetched data
            res.render('admin/cake-page', { admin, adminCakes });
        }
        catch (error) {
            // Handle errors appropriately
            res.status(500).send('Internal Server Error');
        }
    });
}
exports.getAdminCakes = getAdminCakes;
function getAdminCategories(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Assuming you have user information available in req.user after authentication
            const userID = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userID;
            const admin = yield usermodel_1.default.findAll({
                where: { userID: userID, isAdmin: true }, // Adjust the column name according to your database schema
            });
            // Fetch products by user ID
            const adminCakes = yield cakemodel_1.default.findAll({
                where: { userID: userID }, // Adjust the column name according to your database schema
            });
            const categories = yield categorymodel_1.default.findAll();
            // Render the products page with the fetched data
            res.render('admin/category-page', { admin, adminCakes, categories });
        }
        catch (error) {
            // Handle errors appropriately
            res.status(500).send('Internal Server Error');
        }
    });
}
exports.getAdminCategories = getAdminCategories;
const createCake = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log(req.body);
    const validation = cakeSchema.parse(req.body);
    const { cakeName, cakeID, category, description, image, flavour, price, rating, comments, numReviews, } = validation;
    const categoryValue = parseInt(req.body.category, 10);
    const userID = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userID;
    try {
        if (userID == undefined) {
            return res.status(401).json({ message: "unathourized" });
        }
        // Create a cake
        const cake = yield cakemodel_1.default.create({
            cakeName, cakeID, category: categoryValue, description, image, flavour, price, rating, comments, numReviews, userID
        });
        // return res.status(201).json({ status: 'Cake created successfully', cake,  });
        return res.status(201).redirect('/cakemania.ng/admin/cakes');
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            const formattedErrors = error.errors.map((err) => ({
                path: err.path.join('.'),
                message: err.message,
            }));
            return res.status(400).json({
                status: 'failed',
                message: 'Validation errors',
                errors: formattedErrors,
            });
        }
        else {
            console.error('Error creating cake:', error);
            res.status(500).json({ message: 'Failed to create cake', error });
        }
    }
});
exports.createCake = createCake;
const getUpdateCake = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const cakeID = req.params.id;
        const userID = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userID;
        if (!userID) {
            res.json({ status: "failed", message: "unauthoried" });
        }
        const categories = yield categorymodel_1.default.findAll();
        const cake = yield cakemodel_1.default.findByPk(cakeID);
        if (!cake) {
            return res.status(404).render('admin/edit-cake', { message: 'Cake Not Found' });
        }
        res.render('admin/edit-cake', { cake, categories, currentPage: 'edit-cake' });
    }
    catch (error) {
        console.error('Error updating cake:', error);
        res.status(500).json({ message: 'Failed to update cake', error });
    }
});
exports.getUpdateCake = getUpdateCake;
const updateCake = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const cakeID = req.params.id;
        const userID = (_c = req.user) === null || _c === void 0 ? void 0 : _c.userID;
        if (!userID) {
            res.json({ status: "failed", message: "unauthoried" });
        }
        const cake = yield cakemodel_1.default.findByPk(cakeID);
        if (!cake) {
            return res.status(404).json({ message: 'Cake Not Found' });
        }
        yield cake.update(Object.assign({}, req.body));
        // res.status(200).json({ status: 'Cake updated successfully', cake });
        res.redirect('/cakemania.ng/admin/cakes');
    }
    catch (error) {
        console.error('Error updating cake:', error);
        res.status(500).json({ message: 'Failed to update cake', error });
    }
});
exports.updateCake = updateCake;
const deleteCake = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const cake = yield cakemodel_1.default.findByPk(id);
        if (!cake) {
            return res.status(404).json({ message: 'Cake Not Found' });
        }
        console.log("my cake is detroying");
        yield cake.destroy();
        console.log("my cake has destroyed");
        return res.redirect('/cakemania.ng/admin/cakes');
    }
    catch (error) {
        console.error('Error deleting cake:', error);
        res.status(500).json({ message: 'Failed to delete cake', error });
    }
});
exports.deleteCake = deleteCake;
