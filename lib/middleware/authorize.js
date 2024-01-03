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
exports.noCache = exports.adminAuthorization = exports.authorize = void 0;
const usermodel_1 = __importDefault(require("../models/usermodel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authorize = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = req.cookies.token || ((_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', ''));
    // const token = req.cookies.token
    if (!token) {
        return res.redirect('/cakemania.ng/users/login');
        //return res.redirect('/cakemania.ng/users/login')
    }
    try {
        const secret = process.env.secret;
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        // Use Sequelize's findOne method to retrieve the user
        const user = yield usermodel_1.default.findOne({
            where: { userID: decoded.loginkey },
            attributes: ['userID', 'isAdmin'],
        });
        if (!user || user.dataValues.userID == null) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = { userID: user.dataValues.userID, isAdmin: user.dataValues.isAdmin }; // Attach the user to the request for further use
        next();
    }
    catch (error) {
        console.error(error);
        res.render('login', { currentPage: 'login', message: 'Kindly login, your session has expired' });
    }
});
exports.authorize = authorize;
const adminAuthorization = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const token = req.cookies.token || ((_b = req.header('Authorization')) === null || _b === void 0 ? void 0 : _b.replace('Bearer ', ''));
    // const token = req.cookies.token
    try {
        const secret = process.env.secret;
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        // Use Sequelize's findOne method to retrieve the user
        if (decoded.isAdmin === false) {
            // return res.redirect('/cakemania.ng/users/login')
            res.json({ status: "failed", message: "You are not an admin" });
        }
        next();
    }
    catch (error) {
        console.error(error);
        res.status(401).json({ message: 'error in authorization' });
    }
});
exports.adminAuthorization = adminAuthorization;
function noCache(req, res, next) {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
}
exports.noCache = noCache;
// const authUser = 
// (async(req: Request, res:Response, next: NextFunction)=>{
//     const id = req.body.userID
//     if(!id){
//         res.status(400).send("")
//     }
//     const user = await Users.findByPk(id)
//     if (!user) {
//         res.status(401).send("<h1> Not a user. Please sign up </h1>")
//         //res.redirect(/home/register) // not sure of the specific route nor whether or not I should redirect.
//       }
//       next()
// })
// const authAdmin = (async(req: Request, res:Response, next: NextFunction)=>{
//     const id = req.body.userID
//     const user = await Users.findByPk(id)
//     if (!user) {
//         res.status(401).send("<h1> Not a user. Please sign up </h1>")
//     }
//     if (user?.dataValues.isAdmin !== true) {
//         res.status(401).send("<h1> You do not have permisson </h1>")
//       }
//       next()
// })
// export {
//     authAdmin,
//     authUser
// }
/*

const user = await Users.findOne({
        where :{
            userID: id,
        }
    })

*/
/*
const canAddtoCart = (async(req: Request, res:Response, next: NextFunction)=>{
    const id = req.body.userID
    const user = await Users.findByPk(id)
    if (!user) {
        res.status(401).send("<h1> Not a user. Please sign up </h1>")

        //res.redirect(/home/register) // not sure of the specific route nor whether or not I should redirect.
      }
  
      next()
})
*/ 
