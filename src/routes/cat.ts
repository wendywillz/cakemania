import express from "express";
const app = express();
const router = express.Router();
import {addCategory, editCategory, getAllCategories, getCategory, removeCategory} from "../controller/categorycontroller"


router.post('/', addCategory)

router.get('/', getAllCategories)

router.get('/:id', getCategory)

router.put('/:id', editCategory)

router.delete('/:id', removeCategory)


export default router
