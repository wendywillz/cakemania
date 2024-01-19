"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const categorycontroller_1 = require("../controller/categorycontroller");
const app = (0, express_1.default)();
const router = express_1.default.Router();
// router.get('/', getAllCategories)
router.get('/:id', categorycontroller_1.getCategory);
router.put('/:id', categorycontroller_1.editCategory);
router.delete('/:id', categorycontroller_1.removeCategory);
exports.default = router;
