import express, { Request, Response, NextFunction} from 'express';
import multer from "multer"
import path from 'path'

import { signup, login, editUser, deleteUser } from '../controller/usercontroller';
import {addCategory, getCategory, removeCategory, editCategory, getEditCategory } from "../controller/categorycontroller"
import { getAdminDashboard, logout, getAdminCakes, getAdminCategories, createCake, getUpdateCake, updateCake, deleteCake, getAllUsers, getUserByID } from '../controller/admincontroller';
import { authorize, adminAuthorization, noCache } from '../middleware/authorize';


const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/data/uploads')
    },
    filename: (req, file, cb) => {
        console.log(file)
        const uniqueFilename = `${file.fieldname}-${Date.now()}-${path.extname(file.originalname)}`;

        cb(null, uniqueFilename)

    }
})

const upload = multer( { storage: storage})




router.use(authorize)
router.use(adminAuthorization)
router.use(noCache)


router.get('/dashboard', getAdminDashboard)

router.get('/logout', logout )

router.get('/cakes', getAdminCakes)

router.get('/cakes/add-cake', function(req, res, next) {
    res.render('admin/add-cake', { currentPage: 'add-cake', message: null, successMessage: null });
});

router.post('/cakes/add-cake', createCake)

router.get('/cakes/edit-cake/:id', getUpdateCake)

router.put('/cakes/edit-cake/:id',  updateCake)

router.delete('/cakes/remove-cake/:id', deleteCake)

router.get('/categories', getAdminCategories)

router.get('/categories/add-cat', function(req, res, next) {
    res.render('admin/add-cat', { currentPage: 'add-cake', successMessage: null, message: null });
});

router.post('/categories/add-cat', upload.single('categoryImage'), addCategory)

router.get('/categories/edit-cat/:id', getEditCategory)

router.put('/categories/edit-cat/:id', editCategory)

router.delete('/categories/remove-cat/:id', removeCategory)

router.get('/users', getAllUsers)

router.get('/users/:id', getUserByID)


router.delete('/:id', authorize, noCache, deleteUser)






export default router