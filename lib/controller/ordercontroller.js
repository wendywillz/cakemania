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
exports.getCartItems = exports.getOrderTotal = void 0;
const cartmodel_1 = __importDefault(require("../models/cartmodel"));
const cakemodel_1 = __importDefault(require("../models/cakemodel"));
// import Orders from '../models/ordermodel';
// import  UserCart  from "../models/userCartModel";
// import UserOrder from "../models/userOrderModel";
const usermodel_1 = __importDefault(require("../models/usermodel"));
// const orderDetails = async(req: AuthRequest, res:Response)=>{
//     const specificUserID = req.user?.userID;
//     if(!specificUserID){
//         res.status(404).send(`User not found`)
//         throw new Error(`User not fund`)
//     }
//     const order = await Orders.findOne({
//         include:{
//             model:Cart,
//             required:true,
//         }, 
//         where:{userID:specificUserID}})
//     if(!order){
//         res.status(404).send(`Order not found`)
//         throw new Error(`Order not found`)
//     }    
//     order.dataValues.total = await getTotalOrder(specificUserID)
//     }
const getCartItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const specificUserID = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userID;
    const allCartItems = yield cartmodel_1.default.findAll({ where: { userID: specificUserID },
        include: [cakemodel_1.default],
    });
    res.render('orders', { allCartItems, currentPage: 'index' });
});
exports.getCartItems = getCartItems;
////////////////////////////////////////////////////////////////////////////////////////////////////
const getOrderTotal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const userInfo = yield req.cookies.user;
    res.locals.userDetails = userInfo ? JSON.parse(userInfo) : null;
    const userCart = JSON.parse(userInfo).userID ? yield cartmodel_1.default.findAll({
        where: { userID: JSON.parse(userInfo).userID },
    }) : null;
    res.locals.userCart = userCart;
    const specificUserID = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userID;
    const user = yield usermodel_1.default.findByPk(specificUserID);
    const allCartItems = yield cartmodel_1.default.findAll({
        where: { userID: specificUserID },
        include: [cakemodel_1.default], // Cast include to any to prevent TypeScript error
    });
    let tempOrderTotal = 0;
    if (allCartItems.length > 0) {
        for (let cart of allCartItems) {
            tempOrderTotal += parseInt(cart.dataValues.price.replace(/,/g, ''));
        }
    }
    let orderTotal = tempOrderTotal.toLocaleString();
    res.render('orders', { user, allCartItems, orderTotal, currentPage: 'index' });
});
exports.getOrderTotal = getOrderTotal;
function getTotalOrder(userid) {
    return __awaiter(this, void 0, void 0, function* () {
        const allCartItems = yield cartmodel_1.default.findAll({ where: { userID: userid } });
        let tempOrderTotal = 0;
        if (allCartItems.length > 0) {
            for (let cart of allCartItems) {
                tempOrderTotal += parseInt(cart.dataValues.price.replace(/,/g, ''));
            }
        }
        let orderTotal = tempOrderTotal.toLocaleString();
        return orderTotal;
    });
}
/**

////////////////////////////////////////////////////////////////////////////////////////////////////

const randomFunction = async(req: AuthRequest, res:Response)=>{
    const specificUserID = req.user?.userID;
    if(!specificUserID){
        res.status(404).send(`User not found`)
        throw new Error(`User not fund`)
    }
    const allCartItems = await Cart.findAll({where:{userID:specificUserID}})

    let tempOrderTotal:number = 0
    if(allCartItems.length>0){
        for(let cart of allCartItems){
            tempOrderTotal += parseInt(cart.dataValues.price.replace(/,/g, ''))
        }
    }
    let orderTotal = tempOrderTotal.toLocaleString()

    for(let cart of allCartItems){
        await UserCart.create({
            cartID:cart.dataValues.cartID,
            userID: specificUserID,
        })
    }
    }


 */ 
