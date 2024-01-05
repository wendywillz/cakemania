import express, { Request, Response, NextFunction} from 'express';
import { findAllCakes, getCakeById, getCakesByCategory, filterCakesByPrice } from '../controller/cakecontroller';
import { addCakeToCart } from '../controller/cartcontroller';
import { authorize } from '../middleware/authorize';
// const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', findAllCakes )

router.get('/category/:categoryid', getCakesByCategory )

// Define the route for filtering cakes by price
router.post('/cakemania.ng/filterByPrice', filterCakesByPrice);

router.post('/details/:id', authorize, addCakeToCart )

router.get('/details/:id', getCakeById )

// router.put('/:id', authorize, updateCake)




export default router