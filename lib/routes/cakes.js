"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cakecontroller_1 = require("../controller/cakecontroller");
const authorize_1 = require("../middleware/authorize");
// const express = require('express');
const router = express_1.default.Router();
/* GET users listing. */
router.get('/', cakecontroller_1.findAllCakes);
router.get('/:categoryid', cakecontroller_1.getCakeByCategory);
router.get('/:id', cakecontroller_1.findCakeById);
router.post('/create', authorize_1.authorize, cakecontroller_1.createCake);
router.put('/:id', authorize_1.authorize, cakecontroller_1.updateCake);
exports.default = router;
