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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeCakeFromCart = exports.addCakeToCart = exports.addToCart = void 0;
const cartmodel_1 = __importDefault(require("../models/cartmodel"));
const cakemodel_1 = __importDefault(require("../models/cakemodel"));
function addToCart(cakeId, cakeQuantity, size) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let specifiedCake = yield cakemodel_1.default.findByPk(cakeId);
            if (!specifiedCake) {
                throw new Error(`Cake not found`);
            }
            let cakePrice = specifiedCake.dataValues.price;
            let cartItem = yield cartmodel_1.default.findOne({ where: { cakeID: cakeId } });
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
                    cakeID: cakeId,
                    size: size,
                    quantity: cakeQuantity,
                    price: cartPrice
                });
            }
            return cartItem;
        }
        catch (error) {
            throw new Error(`Error adding to cart`);
        }
    });
}
exports.addToCart = addToCart;
const addCakeToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cakeID, quantity, size } = req.body;
        const specificCake = cakemodel_1.default.findByPk(cakeID);
        //const cakeID = specificCake.cakeID
        const cartItem = yield addToCart(cakeID, quantity, size);
        res.status(200).send(`Cake Added to Cart`);
    }
    catch (error) {
        res.status(500).send(`Cake not added to Cart`);
    }
});
exports.addCakeToCart = addCakeToCart;
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
