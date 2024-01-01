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
router.use(authorize_1.authorize);
router.use(authorize_1.adminAuthorization);
router.use(authorize_1.noCache);
router.get('/dashboard', admincontroller_1.getAdminDashboard);
router.get('/logout', admincontroller_1.logout);
router.get('/cakes', admincontroller_1.getAdminCakes);
router.get('/cakes/add-cake', function (req, res, next) {
    res.render('admin/add-cake', { currentPage: 'add-cake', message: null, successMessage: null });
});
router.post('/cakes/add-cake', admincontroller_1.createCake);
router.get('/cakes/edit-cake/:id', admincontroller_1.getUpdateCake);
router.put('/cakes/edit-cake/:id', admincontroller_1.updateCake);
router.delete('/cakes/remove-cake/:id', admincontroller_1.deleteCake);
router.get('/categories', admincontroller_1.getAdminCategories);
router.get('/categories/add-cat', function (req, res, next) {
    res.render('admin/add-cat', { currentPage: 'add-cake', successMessage: null, message: null });
});
router.post('/categories/add-cat', categorycontroller_1.addCategory);
router.get('/categories/edit-cat/:id', categorycontroller_1.getEditCategory);
router.put('/categories/edit-cat/:id', categorycontroller_1.editCategory);
router.delete('/categories/remove-cat/:id', categorycontroller_1.removeCategory);
exports.default = router;
