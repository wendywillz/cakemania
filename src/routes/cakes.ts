import express, { Request, Response, NextFunction} from 'express';
import { createCake, findAllCakes, getCakeById, updateCake, getCakesByCategory } from '../controller/cakecontroller';
import { authorize } from '../middleware/authorize';
// const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', findAllCakes )

router.get('/category/:categoryid', getCakesByCategory )

router.get('/details/:id', getCakeById )

router.post('/create', authorize, createCake)


router.put('/:id', authorize, updateCake)








export default router