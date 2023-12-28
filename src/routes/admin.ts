import express, { Request, Response, NextFunction} from 'express';

import { signup, login, getAllUsers, getUserByID, editUser, deleteUser } from '../controller/usercontroller';
import {addCategory, getAllCategories, getCategory, removeCategory} from "../controller/categorycontroller"
import { getAdminDashboard, getAdminCakes, getAdminCategories, createCake } from '../controller/admincontroller';
import { authorize } from '../middleware/authorize';


const router = express.Router();

router.get('/dashboard', authorize, getAdminDashboard)

router.get('/cakes', authorize, getAdminCakes)

router.get('/cakes/add-cake', authorize, function(req, res, next) {
    res.render('admin/add-cake', { currentPage: 'login', message: null });
});


router.post('/cakes/add-cake', authorize, createCake)

router.get('/categories', authorize, getAdminCategories)

router.post('/category', addCategory)






export default router