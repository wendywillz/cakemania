"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const usercontroller_1 = require("../controller/usercontroller");
const cartcontroller_1 = require("../controller/cartcontroller");
const ordercontroller_1 = require("../controller/ordercontroller");
const authorize_1 = require("../middleware/authorize");
const router = express_1.default.Router();
router.get('/signup', function (req, res, next) {
    res.render('signup', { currentPage: 'signup', message: null, successMessage: null });
});
router.post('/signup', usercontroller_1.signup);
router.get('/login', function (req, res, next) {
    res.render('login', { currentPage: 'login', message: null });
});
router.get('/logout', authorize_1.authorize, authorize_1.noCache, usercontroller_1.logout);
router.post('/login', usercontroller_1.login);
router.get('/profile', authorize_1.authorize, authorize_1.noCache, usercontroller_1.getUserDashboard);
router.get('/cart', authorize_1.authorize, authorize_1.noCache, cartcontroller_1.getUserCart);
router.put('/cart/:id', authorize_1.authorize, authorize_1.noCache, cartcontroller_1.changeCartQuantity);
router.delete('/cart/:id', authorize_1.authorize, authorize_1.noCache, cartcontroller_1.removeCakeFromCart);
router.post('/cart', authorize_1.authorize, authorize_1.noCache);
router.get('/my-orders', authorize_1.authorize, usercontroller_1.getOrdersPage);

router.get('/my-orders', authorize_1.authorize, ordercontroller_1.getOrderTotal);

router.get('/profile/edit/:id', authorize_1.authorize, authorize_1.noCache, usercontroller_1.getEditUser);
router.put('/profile/edit/:id', authorize_1.authorize, authorize_1.noCache, usercontroller_1.editUser);
exports.default = router;
