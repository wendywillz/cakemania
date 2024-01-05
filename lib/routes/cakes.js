"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cakecontroller_1 = require("../controller/cakecontroller");
const cartcontroller_1 = require("../controller/cartcontroller");
const authorize_1 = require("../middleware/authorize");
// const express = require('express');
const router = express_1.default.Router();
/* GET users listing. */
router.get('/', cakecontroller_1.findAllCakes);
router.get('/category/:categoryid', cakecontroller_1.getCakesByCategory);
// Define the route for filtering cakes by price
router.post('/cakemania.ng/filterByPrice', cakecontroller_1.filterCakesByPrice);
router.post('/details/:id', authorize_1.authorize, cartcontroller_1.addCakeToCart);
router.get('/details/:id', cakecontroller_1.getCakeById);
// router.put('/:id', authorize, updateCake)
exports.default = router;
