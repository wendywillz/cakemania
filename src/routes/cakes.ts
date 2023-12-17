import express, { Request, Response, NextFunction} from 'express';
import { createCake, findAllCakes, findCakeById, updateCake } from '../controller/cakecontroller';
import { authorize } from '../middleware/authorize';
// const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', findAllCakes )

router.get('/:id', findCakeById )

router.post('/create', authorize, createCake)


router.put('/:id', authorize, updateCake)








export default router