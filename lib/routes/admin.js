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
router.get('/cakes', authorize_1.authorize, admincontroller_1.getAdminCakes);
router.get('/cakes/add-cake', authorize_1.authorize, function (req, res, next) {
    res.render('admin/add-cake', { currentPage: 'add-cake', message: null });
});
router.post('/cakes/add-cake', authorize_1.authorize, admincontroller_1.createCake);
router.get('/cakes/edit-cake/:id', authorize_1.authorize, admincontroller_1.getUpdateCake);
router.put('/cakes/edit-cake/:id', authorize_1.authorize, admincontroller_1.updateCake);
router.delete('/cakes/remove-cake/:id', authorize_1.authorize, admincontroller_1.deleteCake);
router.get('/categories', authorize_1.authorize, admincontroller_1.getAdminCategories);
router.get('/categories/add-cat', authorize_1.authorize, function (req, res, next) {
    res.render('admin/add-cat', { currentPage: 'add-cake', message: null });
});
router.post('/categories/add-cat', categorycontroller_1.addCategory);
router.get('/categories/edit-cat/:id', authorize_1.authorize, categorycontroller_1.getEditCategory);
router.put('/categories/edit-cat/:id', authorize_1.authorize, categorycontroller_1.editCategory);
router.delete('/categories/remove-cake/:id', authorize_1.authorize, categorycontroller_1.removeCategory);
exports.default = router;
