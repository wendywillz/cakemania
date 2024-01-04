"use strict";
//CART CONTROLLER - REDONE
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserCart = exports.removeCakeFromCart = exports.addCakeToCart = exports.addToCart = void 0;
const cartmodel_1 = __importDefault(require("../models/cartmodel"));
const cakemodel_1 = __importDefault(require("../models/cakemodel"));
function addToCart(cartID, userId, cakeId, cakeQuantity, size) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let specifiedCake = yield cakemodel_1.default.findByPk(cakeId);
            if (!specifiedCake) {
                throw new Error(`Cake not found`);
            }
            let cakePrice = specifiedCake.dataValues.price;
            //cartItem checks that that specific cake has been added by a specific user
            let cartItem = yield cartmodel_1.default.findOne({ where: { cakeID: specifiedCake.dataValues.cakeID,
                    userID: userId }
            });
            //If the cake is already in the cart, just increase the quantity
            if (cartItem) {
                cartItem.dataValues.quantity += cakeQuantity;
                let tempPrice = (parseFloat(cakePrice.split(",").join(""))) * (cartItem.dataValues.quantity);
                cartItem.dataValues.price = tempPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                //Price function would change depending on size. consider using a switch statement
                yield cartItem.save();
            }
            else {
                //if the cake is not in the cart, create a new one.
                let tempcartPrice = (Number(cakePrice.split(",").join(""))) * cakeQuantity;
                let cartPrice = tempcartPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                cartItem = yield cartmodel_1.default.create({
                    cartID,
                    userID: userId,
                    cakeID: cakeId,
                    size: size,
                    quantity: cakeQuantity,
                    price: cartPrice
                });
            }
            return cartItem;
        }
        catch (error) {
            console.error('Error adding to cart', error);
        }
    });
}
exports.addToCart = addToCart;
/*
req: AuthRequest
const userID = req.user?.userID;
const userID = req.cookies.token
*/
const addCakeToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userID = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userID;
        const cartID = __rest(req.body, []);
        if (!userID) {
            res.status(401).json({ error: "unauthorized. please log in" }).redirect("/login");
            throw Error(`User not logged in`);
        }
        const cakeID = req.params.id;
        const quantity = req.body.quantity;
        const size = req.body.size;
        const specificCake = cakemodel_1.default.findByPk(cakeID);
        //const cakeID = specificCake.cakeID
        const cartItem = yield addToCart(cartID, userID, cakeID, quantity, size);
        res.status(200).send(`Cake Added to Cart`);
    }
    catch (error) {
        res.status(500).send(`Cake not added to Cart`);
    }
});
exports.addCakeToCart = addCakeToCart;
const getUserCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const userID = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userID;
        if (!userID) {
            res.status(401).json({ error: "unauthorized. please log in" }).redirect("/login");
            throw Error(`User not logged in`);
        }
        const userCart = yield cartmodel_1.default.findOne({ where: { userID: userID } });
        return userCart;
    }
    catch (error) {
        res.status(400).json({ message: "Error getting cart" });
        console.log(error);
    }
});
exports.getUserCart = getUserCart;
const removeCakeFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const nameOfCake = req.body.cakeName;
        const specificCake = yield cakemodel_1.default.findOne({ where: { cakeName: nameOfCake } });
        if (!specificCake) {
            throw new Error(`Cake not found`);
        }
        const cakeid = specificCake.dataValues.cakeID;
        let cartItem = yield cartmodel_1.default.findOne({ where: { cakeID: cakeid } });
        //find the cake and if it is already in the cart, just remove it. else (throw and error)
        if (cartItem) {
            yield cartItem.destroy();
        }
        else {
            throw new Error(`Cake not in cart`);
        }
        res.status(200).send(`Cake removed from Cart`);
    }
    catch (error) {
        res.status(500).send(`Cake not removed from Cart`);
    }
});
exports.removeCakeFromCart = removeCakeFromCart;
