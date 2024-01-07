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
exports.changeCakeQuantity = exports.changeCartQuantity = exports.getUserCart = exports.removeCakeFromCart = exports.addCakeToCart = exports.addToCart = void 0;
const cartmodel_1 = __importDefault(require("../models/cartmodel"));
const cakemodel_1 = __importDefault(require("../models/cakemodel"));
function addToCart(cartID, userId, cakeId, cakeQuantity, size, cakePrice) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let specifiedCake = yield cakemodel_1.default.findByPk(cakeId);
            if (!specifiedCake) {
                throw new Error(`Cake not found`);
            }
            // let cakePrice = specifiedCake.dataValues.price
            //cartItem checks that that specific cake has been added by a specific user
            let cartItem = yield cartmodel_1.default.findOne({ where: { cakeID: cakeId,
                    userID: userId },
            });
            //If the cake is already in the cart, just increase the quantity
            if (cartItem) {
                cartItem.dataValues.quantity = cartItem.dataValues.quantity + parseInt(cakeQuantity);
                let tempPrice = parseInt(cakePrice.replace(/,/g, '')) * cartItem.dataValues.quantity;
                cartItem.dataValues.price = tempPrice.toLocaleString();
                // cartItem.set({
                //     quantity: cartItem.dataValues.quantity,
                //     price: cartItem.dataValues.price,
                // })
                yield cartmodel_1.default.update({ quantity: cartItem.dataValues.quantity, price: cartItem.dataValues.price }, {
                    where: {
                        cakeID: cakeId,
                        userID: userId
                    },
                });
            }
            else {
                let tempcartPrice = parseInt(cakePrice.replace(/,/g, '')) * cakeQuantity;
                let cartPrice = tempcartPrice.toLocaleString(); // Format price with commas
                cartItem = yield cartmodel_1.default.create({
                    cartID,
                    userID: userId,
                    cakeID: cakeId,
                    size: size,
                    quantity: cakeQuantity,
                    price: cartPrice,
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
const addCakeToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userInfo = yield req.cookies.user;
        res.locals.userDetails = userInfo ? JSON.parse(userInfo) : null;
        const userCart = yield cartmodel_1.default.findAll({
            where: { userID: JSON.parse(userInfo).userID },
        });
        const userID = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userID;
        const { cartID } = req.body;
        if (!userID) {
            res.status(401).redirect("/login");
            throw Error(`User not logged in`);
        }
        const cakeID = req.params.id;
        const quantity = req.body.quantity;
        const size = req.body.size;
        const specificCake = yield cakemodel_1.default.findByPk(cakeID);
        const cake = yield cakemodel_1.default.findByPk(cakeID);
        if (!specificCake) {
            return res.status(404).send("Cake not found");
        }
        let cakePrice = specificCake === null || specificCake === void 0 ? void 0 : specificCake.dataValues.price;
        const cartItem = yield addToCart(cartID, userID, cakeID, quantity, size, cakePrice);
        res.render('product-detail', { successMessage: "cake added to cart", currentPage: "product-detail", cake, userCart });
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
        const userInfo = yield req.cookies.user;
        res.locals.userDetails = userInfo ? JSON.parse(userInfo) : null;
        // const userCart = await Cart.findAll({
        //     where: { userID: JSON.parse(userInfo).userID},
        // })
        if (!userID) {
            res.status(401).redirect("/cakemania.ng/users/login");
            throw Error(`User not logged in`);
        }
        else {
            const userCart = yield cartmodel_1.default.findAll({
                where: { userID: userID },
                include: [cakemodel_1.default], // Cast include to any to prevent TypeScript error
            });
            const newPrice = userCart.reduce((total, cartItem) => {
                return total + (parseInt(cartItem.Cake.dataValues.price.replace(/,/g, '')) * cartItem.dataValues.quantity);
            }, 0);
            const totalPrice = newPrice.toLocaleString();
            res.render('cart', { userCart, totalPrice, currentPage: 'cart' });
        }
    }
    catch (error) {
        res.status(400).json({ message: "Error getting cart" });
        console.log(error);
    }
});
exports.getUserCart = getUserCart;
function changeCakeQuantity(cartID, userId, cakeId, cakeQuantity, size, cakePrice) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let specifiedCake = yield cakemodel_1.default.findByPk(cakeId);
            if (!specifiedCake) {
                throw new Error(`Cake not found`);
            }
            let cartItem = yield cartmodel_1.default.findOne({ where: { cakeID: cakeId,
                    userID: userId },
            });
            if (cartItem) {
                cartItem.dataValues.quantity = parseInt(cakeQuantity);
                let tempPrice = parseInt(cakePrice.replace(/,/g, '')) * cartItem.dataValues.quantity;
                cartItem.dataValues.price = tempPrice.toLocaleString();
                yield cartmodel_1.default.update({ quantity: cartItem.dataValues.quantity, price: cartItem.dataValues.price }, {
                    where: {
                        cakeID: cakeId,
                        userID: userId
                    },
                });
            }
            else {
                throw new Error(`No Cake in Cart`);
            }
            return cartItem;
        }
        catch (error) {
            console.error('Error adding to cart', error);
        }
    });
}
exports.changeCakeQuantity = changeCakeQuantity;
const changeCartQuantity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const userID = (_c = req.user) === null || _c === void 0 ? void 0 : _c.userID;
        const { cartID } = req.body;
        if (!userID) {
            res.status(401).redirect("/login");
            throw Error(`User not logged in`);
        }
        const cakeID = req.params.id;
        const quantity = req.body.quantity;
        const size = req.body.size;
        const specificCake = yield cakemodel_1.default.findByPk(cakeID);
        if (!specificCake) {
            return res.status(404).send("Cake not found");
        }
        let cakePrice = specificCake === null || specificCake === void 0 ? void 0 : specificCake.dataValues.price;
        const cartItem = yield changeCakeQuantity(cartID, userID, cakeID, quantity, size, cakePrice);
        res.status(200).redirect('/cakemania.ng/users/cart');
    }
    catch (error) {
        res.status(500).send(`Cake quantity no changed`);
    }
});
exports.changeCartQuantity = changeCartQuantity;
const removeCakeFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        const cakeID = req.params.id;
        const userID = (_d = req.user) === null || _d === void 0 ? void 0 : _d.userID;
        const specificItem = yield cartmodel_1.default.findOne({ where: { cakeID: cakeID,
                userID: userID
            } });
        if (!specificItem) {
            throw new Error(`Cake not found`);
        }
        else {
            yield specificItem.destroy();
            res.redirect('/cakemania.ng/users/cart');
        }
    }
    catch (error) {
        res.status(500).send(`Cake not removed from Cart`);
    }
});
exports.removeCakeFromCart = removeCakeFromCart;
