"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const categorycontroller_1 = require("../controller/categorycontroller");
const admincontroller_1 = require("../controller/admincontroller");
const authorize_1 = require("../middleware/authorize");
const router = express_1.default.Router();
router.get('/dashboard', authorize_1.authorize, admincontroller_1.getAdminDashboard);
router.post('/category', categorycontroller_1.addCategory);
exports.default = router;
