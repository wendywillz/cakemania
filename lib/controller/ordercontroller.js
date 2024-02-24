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
exports.getOrdersInProfilePage = exports.getOrderSuccessPage = exports.getOrderTotal = exports.getCartItems = exports.createOrder = void 0;
const cartmodel_1 = __importDefault(require("../models/cartmodel"));
const cakemodel_1 = __importDefault(require("../models/cakemodel"));
const ordermodel_1 = __importDefault(require("../models/ordermodel"));
const usermodel_1 = __importDefault(require("../models/usermodel"));
// interface cartItems extends Orders {
//     Cake: Cakes;
//   }
function getTotalOrder(userid) {
    return __awaiter(this, void 0, void 0, function* () {
        const allCartItems = yield cartmodel_1.default.findAll({ where: { userID: userid } });
        let tempOrderTotal = 0;
        if (allCartItems.length > 0) {
            for (let cart of allCartItems) {
                tempOrderTotal += parseInt(cart.dataValues.price.replace(/,/g, ""));
            }
        }
        let orderTotal = tempOrderTotal.toLocaleString();
        return orderTotal;
    });
}
function createOrder(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const specificUserID = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userID;
            const userInfo = yield req.cookies.user;
            res.locals.userDetails = userInfo ? JSON.parse(userInfo) : null;
            if (!specificUserID) {
                res.redirect("/cakemania.ng/users/login");
            }
            else {
                const userCart = JSON.parse(userInfo).userID
                    ? yield cartmodel_1.default.findAll({
                        where: { userID: JSON.parse(userInfo).userID },
                    })
                    : null;
                res.locals.userCart = userCart;
                const userItems = (yield cartmodel_1.default.findAll({
                    where: {
                        userID: specificUserID,
                    },
                    include: [cakemodel_1.default], // Cast include to any to prevent TypeScript error
                }));
                //   const orderItems = {
                //     items: userItems,
                //   };
                const orderItems = userItems.map((item) => ({
                    cartID: item.dataValues.cartID,
                    cakeID: item.dataValues.cakeID,
                    cakeName: item.Cake.dataValues.cakeName,
                    cakeImage: item.Cake.dataValues.image,
                    quantity: item.dataValues.quantity,
                    price: item.dataValues.price,
                    size: item.dataValues.quantity,
                    userID: item.dataValues.userID,
                    // ... other item details you might want to include
                }));
                const orderID = req.body.orderID;
                const totalOrder = yield getTotalOrder(specificUserID);
                const deliveryPhoneNo = req.body.deliveryPhoneNo;
                const deliveryAddress = req.body.deliveryAddress;
                const deliveryState = req.body.deliveryState;
                const lga = req.body.lga;
                const additionalInfo = req.body.additionalInfo;
                const orderTime = Date.now();
                const deliveryStatus = req.body.deliveryStatus;
                console.log(orderID);
                const placedOrder = yield ordermodel_1.default.create({
                    orderID,
                    userID: specificUserID,
                    orderItems,
                    total: totalOrder,
                    deliveryStatus,
                    deliveryPhoneNo,
                    deliveryAddress,
                    lga,
                    additionalInfo,
                    deliveryState,
                    orderTime,
                });
                console.log(placedOrder);
                res.redirect("/cakemania.ng/users/order/success");
            }
        }
        catch (error) {
            console.error(error);
        }
    });
}
exports.createOrder = createOrder;
function getCartItems(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const specificUserID = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userID;
        const allCartItems = yield cartmodel_1.default.findAll({
            where: { userID: specificUserID },
            include: [cakemodel_1.default],
        });
        res.render("orders", { allCartItems, currentPage: "index" });
    });
}
exports.getCartItems = getCartItems;
function getOrderTotal(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const userInfo = yield req.cookies.user;
        res.locals.userDetails = userInfo ? JSON.parse(userInfo) : null;
        const userCart = JSON.parse(userInfo).userID
            ? yield cartmodel_1.default.findAll({
                where: { userID: JSON.parse(userInfo).userID },
            })
            : null;
        res.locals.userCart = userCart;
        const specificUserID = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userID;
        const user = yield usermodel_1.default.findByPk(specificUserID);
        const allCartItems = (yield cartmodel_1.default.findAll({
            where: { userID: specificUserID },
            include: [cakemodel_1.default],
        }));
        let tempOrderTotal = 0;
        if (allCartItems.length > 0) {
            for (let cart of allCartItems) {
                tempOrderTotal += parseInt(cart.dataValues.price.replace(/,/g, ""));
            }
        }
        let orderTotal = tempOrderTotal.toLocaleString();
        res.render("orders", {
            user,
            allCartItems,
            orderTotal,
            currentPage: "index",
        });
    });
}
exports.getOrderTotal = getOrderTotal;
function getOrderSuccessPage(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userID = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userID;
            if (!userID) {
                res.render("login", { message: "unauthorized" });
            }
            else {
                const user = yield usermodel_1.default.findByPk(userID);
                res.render("order-success", { currentPage: "index", user });
            }
        }
        catch (error) {
            console.error(error);
        }
    });
}
exports.getOrderSuccessPage = getOrderSuccessPage;
function getOrdersInProfilePage(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userID = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userID;
            const usersOrders = yield ordermodel_1.default.findAll({
                where: {
                    userID: userID,
                },
                include: [
                    {
                        model: cartmodel_1.default,
                        as: "cartItems",
                        include: [cakemodel_1.default],
                    },
                ],
            });
            console.log(usersOrders);
            const formattedOrders = usersOrders.map((order) => {
                const orderItemsDetails = Array.isArray(order.dataValues.orderItems)
                    ? order.dataValues.orderItems.map((item) => ({
                        cartID: item.cartID,
                        cakeID: item.cakeID,
                        cakeName: item.Cake.cakeName,
                        cakeImage: item.Cake.image,
                        quantity: item.quantity,
                        price: item.price,
                        size: item.size,
                        userID: item.userID,
                        // ... other item details you might want to include
                    }))
                    : [];
                console.log(orderItemsDetails);
                return {
                    orderID: order.dataValues.orderID,
                    userID: order.dataValues.userID,
                    orderItems: orderItemsDetails,
                    total: order.dataValues.total,
                    deliveryStatus: order.dataValues.deliveryStatus,
                    deliveryPhoneNo: order.dataValues.deliveryPhoneNo,
                    deliveryAddress: order.dataValues.deliveryAddress,
                    lga: order.dataValues.lga,
                    additionalInfo: order.dataValues.additionalInfo,
                    deliveryState: order.dataValues.deliveryState,
                    orderTime: order.dataValues.orderTime,
                };
            });
            console.log(formattedOrders);
            res.render("users/user-orders", {
                currentPage: "user-dashboard",
                formattedOrders,
            });
        }
        catch (error) {
            console.error(error);
        }
    });
}
exports.getOrdersInProfilePage = getOrdersInProfilePage;
// /*
// //finding if the order already exists
// const existingUsercart = await UserOrder.findOne({where:{userID: specificUserID},
// include:{
//     model:Orders,
//     required:true,
//     where:{
//         userID: specificUserID
//     }
// }})
// const existingOrder = await Orders.findOne({where:{userID: specificUserID}}) //find something else to query the Order. if you use the userID, the next time the same user makes an order, it would throw an error because there already exists an order with that userID. maybe use something specific to that order like the sessionID used to make it.
// if(existingOrder){
//     res.status(400).send(`Order already exists`)
//     throw new Error(`Order already exists`)
// }
// */
// const getAllOrderItems = async(req:AuthRequest, res:Response) =>{
//     const specificUserID = req.user?.userID;
//     if(!specificUserID){
//         res.status(404).send(`User not found`)
//         throw new Error(`User not found`)
//     }
//     const specificOrder = await Orders.findOne({where:{userID:specificUserID}})
//     /*
//     const specificOrder = await Orders.findOne({where:{userID:specificUserID},
//         include:{model: UserCart,
//             where:{userID:specificUserID}}})
//     */
//     if(!specificOrder){
//         res.status(404).send(`Order not found`)
//         throw new Error(`Order not found`)
//     }
//     const allOrderItems = await UserCart.findAll({where:{userID:specificOrder.dataValues.userID}})
//     return allOrderItems
// }
