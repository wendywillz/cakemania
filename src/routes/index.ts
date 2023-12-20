import express, { Request, Response, NextFunction} from 'express';
import { getAllCategories } from '../controller/categorycontroller';

var router = express.Router();

/* GET home page. */
router.get('/', getAllCategories)

export default router;
