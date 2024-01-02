import express, { Request, Response, NextFunction} from 'express';

import { signup, login, logout, getUserDashboard, getAllUsers, getUserByID, getEditUser, editUser, deleteUser, getUserOrders } from '../controller/usercontroller';
import { authorize, noCache } from '../middleware/authorize';


const router = express.Router();

router.get('/signup', function(req, res, next) {
  res.render('signup', { currentPage: 'signup', message: null, successMessage: null  });
});

router.post('/signup', signup)


router.get('/login', function(req, res, next) {
    res.render('login', { currentPage: 'login', message: null });
});

router.get('/logout', authorize, noCache, logout )


router.post('/login', login)


router.get('/profile', authorize, noCache, getUserDashboard  )

router.get('/profile/edit/:id', authorize, noCache, getEditUser )

router.put('/profile/edit/:id', authorize, noCache, editUser)


router.get('/profile/orders', authorize, noCache, getUserOrders  )


router.get('/', getAllUsers)

router.get('/:id', getUserByID)


router.delete('/:id', authorize, noCache, deleteUser)




export default router