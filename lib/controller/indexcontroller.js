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
exports.getUserNavbar = void 0;
const categoryModel_1 = __importDefault(require("../models/categoryModel"));
const cartmodel_1 = __importDefault(require("../models/cartmodel"));
function getUserNavbar(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userInfo = yield ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.user);
            if (!userInfo) {
                const allCategories = yield categoryModel_1.default.findAll();
                return res.render('index', { allCategories: allCategories, currentPage: 'index' });
            }
            else {
                res.locals.userDetails = userInfo ? JSON.parse(userInfo) : null;
                const userCart = JSON.parse(userInfo).userID ? yield cartmodel_1.default.findAll({
                    where: { userID: JSON.parse(userInfo).userID },
                })
                    : null;
                res.locals.userCart = userCart;
                const allCategories = yield categoryModel_1.default.findAll();
                res.render('index', { allCategories: allCategories || [], currentPage: 'index' });
            }
        }
        catch (error) {
            res.render('index', { currentPage: 'index', userDetails: null });
        }
    });
}
exports.getUserNavbar = getUserNavbar;
;
// export  function logout(req: AuthRequest, res: Response) {
//     try {
//       res.clearCookie('token');
//       res.clearCookie('user');
//       res.redirect('/cakemania.ng');
//     } catch (error) {
//       console.error('Error during logout:', error);
//       res.status(500).send('Internal Server Error');
//     }
//   }
