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
exports.getAdminDashboard = void 0;
const usermodel_1 = __importDefault(require("../models/usermodel"));
const cakemodel_1 = __importDefault(require("../models/cakemodel"));
function getAdminDashboard(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Assuming you have user information available in req.user after authentication
            const userID = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userID;
            const admin = yield usermodel_1.default.findAll({
                where: { userID: userID, isAdmin: true }, // Adjust the column name according to your database schema
            });
            // Fetch products by user ID
            const adminCakes = yield cakemodel_1.default.findAll({
                where: { userID: userID }, // Adjust the column name according to your database schema
            });
            // Render the products page with the fetched data
            res.render('admin-index', { admin, adminCakes });
        }
        catch (error) {
            // Handle errors appropriately
            res.status(500).send('Internal Server Error');
        }
    });
}
exports.getAdminDashboard = getAdminDashboard;
