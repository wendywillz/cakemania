import express, { Request, Response, NextFunction} from 'express';

import { signup, login, getAllUsers, getUserByID, editUser, deleteUser } from '../controller/usercontroller';
import {addCategory, getAllCategories, getCategory, removeCategory} from "../controller/categorycontroller"
import { getAdminDashboard } from '../controller/admincontroller';
import { authorize } from '../middleware/authorize';


const router = express.Router();

router.get('/dashboard', authorize, getAdminDashboard)

router.post('/category', addCategory)




export default router