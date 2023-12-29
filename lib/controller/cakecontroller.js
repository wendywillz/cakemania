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
exports.getCakesByCategory = exports.getCakeById = exports.findAllCakes = void 0;
const cakemodel_1 = __importDefault(require("../models/cakemodel")); // Import cake models
const zod_1 = require("zod");
const validate_1 = require("../validation/validate");
const { cakeSchema } = validate_1.validationSchemas;
const findAllCakes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cakes = yield cakemodel_1.default.findAll();
        res.status(200).json({ status: 'success', cakes });
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
            console.error('Error fetching cakes:', error);
            res.status(500).json({ message: 'Failed to fetch cakes', error });
        }
    }
});
exports.findAllCakes = findAllCakes;
const getCakeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cakeID = req.params.id;
        const cake = yield cakemodel_1.default.findByPk(cakeID);
        if (!cake) {
            return res.status(404).json({ message: 'Cake Not Found' });
        }
        // res.status(200).json({ status: 'success', cake });
        res.status(200).render('product-detail', { cake, currentPage: "product-detail" });
    }
    catch (error) {
        console.error('Error fetching cake:', error);
        res.status(500).json({ message: 'Failed to fetch cake', error });
    }
});
exports.getCakeById = getCakeById;
const getCakesByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryID = req.params.categoryid;
    try {
        // Find cakes by category ID
        const cakes = yield cakemodel_1.default.findAll({
            where: { category: categoryID },
        });
        if (!cakes) {
            // res.json({ status: "successful", message: "No cakes in this category"})
            res.status(400).render('products', { message: "no cakes available in this category" });
        }
        res.status(200).render('products', { cakes, currentPage: 'products' });
    }
    catch (error) {
        console.error('Error fetching cakes by category:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getCakesByCategory = getCakesByCategory;
