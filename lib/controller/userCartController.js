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
exports.createUserCarts = exports.deleteUserCart = void 0;
const cartmodel_1 = __importDefault(require("../models/cartmodel"));
const userCartModel_1 = __importDefault(require("../models/userCartModel"));
const ordermodel_1 = __importDefault(require("../models/ordermodel"));
const createUserCarts = (newOrderId) => __awaiter(void 0, void 0, void 0, function* () {
    const specificOrder = yield ordermodel_1.default.findByPk(newOrderId);
    if (!specificOrder) {
        throw new Error(`Order does not exist`);
    }
    const specificUserId = specificOrder.dataValues.userID;
    const allUserCarts = yield cartmodel_1.default.findAll({ where: { userID: specificUserId } });
    console.log(allUserCarts);
    for (let userCart of allUserCarts) {
        yield userCartModel_1.default.create({
            orderID: newOrderId,
            userID: specificUserId,
            cartID: userCart.dataValues.cartID
        });
    }
    const createdUserCarts = yield userCartModel_1.default.findAll({ where: { orderID: newOrderId } });
    return createdUserCarts;
});
exports.createUserCarts = createUserCarts;
////////////////////////////////////////////////////////////////////////////////////////////////////
//GET USER CARTS
function getUserCart(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const allCartItems = yield userCartModel_1.default.findAll({ where: { userID: userId } });
    });
}
const getOrderItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const specificUserID = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userID;
    if (!specificUserID) {
        res.status(401).redirect("/cakemania.ng/users/login");
        throw Error(`User not logged in`);
    }
    const allOrderITems = yield getUserCart(specificUserID);
    return allOrderITems;
});
////////////////////////////
//DELETE  ALL USER CARTS
const deleteUserCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const specificUserID = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userID;
    const allUserCarts = yield cartmodel_1.default.findAll({ where: { userID: specificUserID } });
    console.log(allUserCarts);
    for (let userCart of allUserCarts) {
        yield userCart.destroy();
    }
});
exports.deleteUserCart = deleteUserCart;
