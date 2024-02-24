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
exports.filterCakesByPrice = exports.getCakesByCategory = exports.getCakeById = exports.findAllCakes = void 0;
const cakemodel_1 = __importDefault(require("../models/cakemodel")); // Import cake models
const cartmodel_1 = __importDefault(require("../models/cartmodel"));
const zod_1 = require("zod");
const sequelize_1 = require("sequelize");
const validate_1 = require("../validation/validate");
const { cakeSchema } = validate_1.validationSchemas;
const findAllCakes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cakes = yield cakemodel_1.default.findAll();
        const userInfo = req.cookies.user ? yield req.cookies.user : "";
        console.log(userInfo);
        res.locals.userDetails = userInfo !== "" ? JSON.parse(userInfo) : "";
        const userCart = userInfo !== ""
            ? yield cartmodel_1.default.findAll({
                where: { userID: JSON.parse(userInfo).userID },
            })
            : null;
        res.locals.userCart = userCart;
        console.log(userCart);
        res.render("all-products", { cakes, currentPage: "index" });
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
            console.error("Error fetching cakes:", error);
            res.status(500).json({ message: "Failed to fetch cakes", error });
        }
    }
});
exports.findAllCakes = findAllCakes;
const getCakeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cakeID = req.params.id;
        const cake = yield cakemodel_1.default.findByPk(cakeID);
        const userInfo = req.cookies.user ? yield req.cookies.user : "";
        res.locals.userDetails = userInfo !== "" ? JSON.parse(userInfo) : "";
        const userCart = userInfo !== ""
            ? yield cartmodel_1.default.findAll({
                where: { userID: JSON.parse(userInfo).userID },
            })
            : null;
        res.locals.userCart = userCart;
        if (!cake) {
            return res.status(404).json({ message: "Cake Not Found" });
        }
        // res.status(200).json({ status: 'success', cake });
        res.status(200).render("product-detail", {
            cake,
            currentPage: "product-detail",
            successMessage: null,
        });
    }
    catch (error) {
        console.error("Error fetching cake:", error);
        res.status(500).json({ message: "Failed to fetch cake", error });
    }
});
exports.getCakeById = getCakeById;
const getCakesByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryID = req.params.categoryid;
        const userInfo = yield req.cookies.user;
        res.locals.userDetails = userInfo ? JSON.parse(userInfo) : null;
        // Find cakes by category ID
        const cakes = yield cakemodel_1.default.findAll({
            where: { category: categoryID },
        });
        if (!cakes) {
            // res.json({ status: "successful", message: "No cakes in this category"})
            res.render("products", {
                message: "no cakes available in this category",
            });
        }
        res.render("products", { cakes, currentPage: "products" });
    }
    catch (error) {
        console.error("Error fetching cakes by category:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getCakesByCategory = getCakesByCategory;
const filterCakesByPrice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { priceRange } = req.body;
        const userInfo = yield req.cookies.user;
        res.locals.userDetails = userInfo ? JSON.parse(userInfo) : null;
        // Implement logic to filter cakes based on the price range
        const filteredCakes = yield cakemodel_1.default.findAll({
            where: {
                price: {
                    [sequelize_1.Op.lte]: priceRange, // Assuming you want cakes with price less than or equal to the selected range
                },
            },
        });
        // Render the filtered cakes on the page
        res.render("products", { cakes: filteredCakes, currentPage: "products" });
    }
    catch (error) {
        handleControllerError(error, res);
    }
});
exports.filterCakesByPrice = filterCakesByPrice;
// Helper function to handle errors in the controller
const handleControllerError = (error, res) => {
    console.error("Error in controller:", error);
    res.status(500).json({ message: "Internal Server Error", error });
};
