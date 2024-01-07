import express from "express";


import {addCategory, editCategory,  getCategory, removeCategory} from "../controller/categorycontroller"


const app = express();
const router = express.Router();



// router.get('/', getAllCategories)

router.get('/:id', getCategory)

router.put('/:id', editCategory)

router.delete('/:id', removeCategory)


export default router
