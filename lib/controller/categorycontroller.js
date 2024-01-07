"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategory = exports.addCategory = exports.removeCategory = exports.editCategory = exports.getEditCategory = void 0;
const categoryModel_1 = __importDefault(require("../models/categoryModel"));
const validate_1 = require("../validation/validate");
const zod_1 = require("zod");
const { signupSchema, loginSchema, cakeSchema, categorySchema, orderItemsSchema, orderSchema } = validate_1.validationSchemas;
// const getAllCategories = (async(req:Request , res:Response )=> {
//     const allCategories = await Categories.findAll({})
//     if(!allCategories){
//         res.status(404).send("NO CATEGORIES FOUND")
//     }
//     res.render('index', { allCategories, currentPage: 'index' })
// })
const getCategory = ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const {categoryName, categoryID} = req.body
    // const category = Categories.findOne({
    //     where: {
    //         categoryName: categoryName
    //     }
    // })
    const category = yield categoryModel_1.default.findByPk(req.params.id);
    if (!category) {
        res.status(400).send("CATEGORY DOES NOT EXIST");
    }
    res.status(200).json(category);
}));
exports.getCategory = getCategory;
const addCategory = ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        console.log(req.body);
        console.log(req.file);
        const validation = categorySchema.parse(req.body);
        const { categoryName } = validation;
        const categoryImage = (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename;
        const existingCategory = yield categoryModel_1.default.findOne({
            where: {
                categoryName: categoryName
            }
        });
        if (existingCategory) {
            res.render('admin/add-cat', { message: "Category already exists", successMessage: '' });
        }
        if (req.file === undefined) {
            res.json({ message: "No file uploaded" });
        }
        else {
            const newCategory = yield categoryModel_1.default.create({
                categoryName: categoryName,
                categoryImage: req.file.filename
            });
            res.render('admin/add-cat', { successMessage: "Category has been successfully added", message: '' });
            // res.redirect('/cakemania.ng/admin/categories')
        }
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            const formattedErrors = error.errors.map((err) => (err.message));
            console.log(error);
            console.log(formattedErrors);
            return res.render('admin/add-cat', {
                currentPage: "add-cat",
                message: formattedErrors.join(''),
                successMessage: ''
            });
        }
        else {
            console.error("Error creating user:", error);
            return res
                .status(500)
                .render('admin/add-cat', { currentPage: 'add-cat', message: "Internal server error", successMessage: '' });
        }
    }
}));
exports.addCategory = addCategory;
const getEditCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const categoryID = req.params.id;
        const userID = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userID;
        if (!userID) {
            res.json({ status: "failed", message: "unauthoried" });
        }
        //   const categories = await Categories.findAll()
        const category = yield categoryModel_1.default.findByPk(categoryID);
        if (!category) {
            return res.render('admin/edit-cat', { message: 'Category does not exist' });
        }
        res.render('admin/edit-cat', { category, currentPage: 'edit-cat' });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to update cake', error });
    }
});
exports.getEditCategory = getEditCategory;
function editCategory(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const categoryID = req.params.id;
            const userID = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userID;
            if (!userID) {
                res.json({ status: "failed", message: "unauthoried" });
            }
            const category = yield categoryModel_1.default.findByPk(categoryID);
            if (!category) {
                return res.status(404).json({ message: 'Category Not Found' });
            }
            yield category.update(Object.assign({}, req.body));
            // res.status(200).json({ status: 'Cake updated successfully', cake });
            res.redirect('/cakemania.ng/admin/categories');
        }
        catch (error) {
            res.status(500).json({ message: 'server error' });
        }
    });
}
exports.editCategory = editCategory;
;
const removeCategory = ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryID = req.params.id;
        const categories = yield categoryModel_1.default.findAll();
        const category = yield categoryModel_1.default.findByPk(categoryID);
        /**
         OR:
         const category = Categories.findByPk(req.params.id)
         */
        if (category) {
            yield category.destroy();
            res.render('admin/category-page', { categories, message: "Category has been removed" });
            // res.redirect('/cakemania.ng/admin/categories')
        }
        else {
            res.render('admin/category-page', { categories, message: "Category does not exist" });
        }
    }
    catch (error) {
        // res.render('admin/category-page', { message: "failed, incorrect details", successMessage: ''})
    }
}));
exports.removeCategory = removeCategory;
