import express, { Request, Response, NextFunction} from 'express';

import { signup, login, getAllUsers, getUserByID, editUser, deleteUser } from '../controller/usercontroller';
import {addCategory, getAllCategories, getCategory, removeCategory, editCategory, getEditCategory } from "../controller/categorycontroller"
import { getAdminDashboard, logout, getAdminCakes, getAdminCategories, createCake, getUpdateCake, updateCake, deleteCake } from '../controller/admincontroller';
import { authorize, adminAuthorization, noCache } from '../middleware/authorize';


const router = express.Router();

router.use(authorize)
router.use(adminAuthorization)
router.use(noCache)


router.get('/dashboard', getAdminDashboard)

router.get('/logout', logout )

router.get('/cakes', getAdminCakes)

router.get('/cakes/add-cake', function(req, res, next) {
    res.render('admin/add-cake', { currentPage: 'add-cake', message: null, successMessage: null });
});

router.post('/cakes/add-cake', createCake)

router.get('/cakes/edit-cake/:id', getUpdateCake)

router.put('/cakes/edit-cake/:id',  updateCake)

router.delete('/cakes/remove-cake/:id', deleteCake)

router.get('/categories', getAdminCategories)

router.get('/categories/add-cat', function(req, res, next) {
    res.render('admin/add-cat', { currentPage: 'add-cake', successMessage: null, message: null });
});

router.post('/categories/add-cat', addCategory)

router.get('/categories/edit-cat/:id', getEditCategory)

router.put('/categories/edit-cat/:id', editCategory)

router.delete('/categories/remove-cat/:id', removeCategory)






export default router