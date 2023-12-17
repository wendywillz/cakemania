import express from "express";
const app = express();
const router = express.Router();
import {addCategory, getAllCategories, getCategory, removeCategory} from "../controller/categorycontroller"

router.route("/cat").get(getAllCategories).post(addCategory)
router.route("/:id").get(getCategory).post(removeCategory)