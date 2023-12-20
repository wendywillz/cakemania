"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const categorycontroller_1 = require("../controller/categorycontroller");
var router = express_1.default.Router();
/* GET home page. */
router.get('/', categorycontroller_1.getAllCategories);
exports.default = router;
