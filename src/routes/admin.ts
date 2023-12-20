import express, { Request, Response, NextFunction} from 'express';

import { signup, login, getAllUsers, getUserByID, editUser, deleteUser } from '../controller/usercontroller';
import {addCategory, getAllCategories, getCategory, removeCategory} from "../controller/categorycontroller"


const router = express.Router();

router.get('/dashboard')

router.post('/category', addCategory)






export default router