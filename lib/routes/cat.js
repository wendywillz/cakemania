"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const router = express_1.default.Router();
const categorycontroller_1 = require("../controller/categorycontroller");
router.route("/cat").get(categorycontroller_1.getAllCategories).post(categorycontroller_1.addCategory);
router.route("/:id").get(categorycontroller_1.getCategory).post(categorycontroller_1.removeCategory);
