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
exports.orderCake = void 0;
const ordermodel_1 = __importDefault(require("../models/ordermodel"));
const validate_1 = require("../validation/validate");
const { orderSchema } = validate_1.validationSchemas;
const zod_1 = require("zod");
const orderCake = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validation = orderSchema.parse(req.body);
        const { total, status, deliveryPhoneNo, deliveryAddress, deliveryState, deliveryLga, additionalInfo } = validation;
        const orderedCake = yield ordermodel_1.default.create(validation);
        res.status(201).json(orderedCake);
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
            console.error("Error creating cake", error);
            return res
                .status(500)
                .json({ status: "error", message: "Internal server error" });
        }
    }
});
exports.orderCake = orderCake;
