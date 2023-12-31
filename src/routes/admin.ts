import express, { Request, Response, NextFunction} from 'express';

import { signup, login, getAllUsers, getUserByID, editUser, deleteUser } from '../controller/usercontroller';
import {addCategory, getAllCategories, getCategory, removeCategory, editCategory, getEditCategory } from "../controller/categorycontroller"
import { getAdminDashboard, logout, getAdminCakes, getAdminCategories, createCake, getUpdateCake, updateCake, deleteCake } from '../controller/admincontroller';
import { authorize, noCache } from '../middleware/authorize';


const router = express.Router();

router.get('/dashboard', authorize, noCache, getAdminDashboard)

router.get('/logout', authorize,logout )

router.get('/cakes', authorize, getAdminCakes)

router.get('/cakes/add-cake', authorize, function(req, res, next) {
    res.render('admin/add-cake', { currentPage: 'add-cake', message: null });
});

router.post('/cakes/add-cake', authorize, createCake)

router.get('/cakes/edit-cake/:id', authorize, getUpdateCake)

router.put('/cakes/edit-cake/:id', authorize, updateCake)

router.delete('/cakes/remove-cake/:id', authorize, deleteCake)

router.get('/categories', authorize, getAdminCategories)

router.get('/categories/add-cat', authorize, function(req, res, next) {
    res.render('admin/add-cat', { currentPage: 'add-cake', message: null });
});

router.post('/categories/add-cat', addCategory)

router.get('/categories/edit-cat/:id', authorize, getEditCategory)

router.put('/categories/edit-cat/:id', authorize, editCategory)

router.delete('/categories/remove-cat/:id', authorize, removeCategory)






export default router