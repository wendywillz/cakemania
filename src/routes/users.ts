import express, { Request, Response, NextFunction} from 'express';

import { signup, login, getAllUsers, getUserByID, editUser, deleteUser } from '../controller/usercontroller';


const router = express.Router();


router.post('/signup', signup)

router.post('/login', login)

router.get('/', getAllUsers)

router.get('/:id', getUserByID)

router.put('/:id', editUser)

router.delete('/:id', deleteUser)


export default router