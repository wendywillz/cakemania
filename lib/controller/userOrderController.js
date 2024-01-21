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
exports.deleteUserOrder = exports.createUserOrder = void 0;
const userOrderModel_1 = __importDefault(require("../models/userOrderModel"));
const ordermodel_1 = __importDefault(require("../models/ordermodel"));
const uuid_1 = require("uuid");
const createUserOrder = (newOrderId) => __awaiter(void 0, void 0, void 0, function* () {
    const specificOrder = yield ordermodel_1.default.findByPk(newOrderId);
    if (!specificOrder) {
        throw new Error(`Order does not exist`);
    }
    const specificUserId = specificOrder.dataValues.userID;
    const userOrderID = (0, uuid_1.v4)();
    const newUserOrder = yield userOrderModel_1.default.create({
        userOrderID: userOrderID,
        orderID: newOrderId,
        userID: specificUserId,
    });
    return newUserOrder;
});
exports.createUserOrder = createUserOrder;
////////////////////////////////////////////////////////////////////////////////////////////////////
//DELETE USER ORDERS
const deleteUserOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const specificUserID = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userID;
    const existingUserOrder = yield userOrderModel_1.default.findOne({ where: { userID: specificUserID } });
    if (!existingUserOrder) {
        res.status(404).send(`<h1>USER ORDER NOT FOUND</h1>`);
        throw new Error(`User order not found`);
    }
    yield existingUserOrder.destroy();
});
exports.deleteUserOrder = deleteUserOrder;
