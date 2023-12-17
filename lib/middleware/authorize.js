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
exports.authUser = exports.authAdmin = void 0;
const usermodel_1 = __importDefault(require("../models/usermodel"));
const authUser = ((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.body.userID;
    if (!id) {
        res.status(400).send("");
    }
    const user = yield usermodel_1.default.findByPk(id);
    if (!user) {
        res.status(401).send("<h1> Not a user. Please sign up </h1>");
        //res.redirect(/home/register) // not sure of the specific route nor whether or not I should redirect.
    }
    next();
}));
exports.authUser = authUser;
const authAdmin = ((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.body.userID;
    const user = yield usermodel_1.default.findByPk(id);
    if (!user) {
        res.status(401).send("<h1> Not a user. Please sign up </h1>");
    }
    if (user.isAdmin !== true) {
        res.status(401).send("<h1> You do not have permisson </h1>");
    }
    next();
}));
exports.authAdmin = authAdmin;
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
