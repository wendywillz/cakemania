import express, { Request, Response, NextFunction} from 'express';

import { signup, login, getUserDashboard, getAllUsers, getUserByID, getEditUser, editUser, deleteUser, getUserOrders } from '../controller/usercontroller';
import { authorize } from '../middleware/authorize';


const router = express.Router();

router.get('/signup', function(req, res, next) {
  res.render('signup', { currentPage: 'signup', message: null, successMessage: null  });
});

router.post('/signup', signup)


router.get('/login', function(req, res, next) {
    res.render('login', { currentPage: 'login', message: null });
});

router.post('/login', login)


router.get('/profile', authorize, getUserDashboard  )

router.get('/profile/edit/:id', authorize, getEditUser )


router.get('/profile/orders', authorize, getUserOrders  )


router.get('/', getAllUsers)

router.get('/:id', getUserByID)

router.put('/:id', editUser)

router.delete('/:id', deleteUser)




export default router