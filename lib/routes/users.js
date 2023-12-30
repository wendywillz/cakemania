"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const usercontroller_1 = require("../controller/usercontroller");
const authorize_1 = require("../middleware/authorize");
const router = express_1.default.Router();
router.get('/signup', function (req, res, next) {
    res.render('signup', { currentPage: 'signup', message: null });
});
router.post('/signup', usercontroller_1.signup);
router.get('/login', function (req, res, next) {
    res.render('login', { currentPage: 'login', message: null });
});
router.post('/login', usercontroller_1.login);
router.get('/profile', authorize_1.authorize, usercontroller_1.getUserProfile);
router.get('/', usercontroller_1.getAllUsers);
router.get('/:id', usercontroller_1.getUserByID);
router.put('/:id', usercontroller_1.editUser);
router.delete('/:id', usercontroller_1.deleteUser);
exports.default = router;
