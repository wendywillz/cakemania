import express, { Request, Response, NextFunction} from 'express';

import { signup, login, getAllUsers, getUserByID, editUser, deleteUser } from '../controller/usercontroller';


const router = express.Router();

router.get('/dashboard')






export default router