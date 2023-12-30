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
exports.getCategory = exports.getAllCategories = exports.addCategory = exports.removeCategory = exports.editCategory = exports.getEditCategory = void 0;
const categoryModel_1 = __importDefault(require("../models/categoryModel"));
const getAllCategories = ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allCategories = yield categoryModel_1.default.findAll({});
    if (!allCategories) {
        res.status(404).send("NO CATEGORIES FOUND");
    }
    res.status(200).render('index', { allCategories, currentPage: 'index' });
}));
exports.getAllCategories = getAllCategories;
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
    const { categoryName, categoryImage } = req.body;
    const existingCategory = yield categoryModel_1.default.findOne({
        where: {
            categoryName: categoryName
        }
    });
    /*
     const existingCategory = Categories.findByPk(categoryID)
    */
    if (existingCategory) {
        res.status(400).json({ status: "failed", message: "Category already exists" });
    }
    const newCategory = yield categoryModel_1.default.create(req.body);
    // res.status(200).json({ status: "successful", category: newCategory})
    res.redirect('/cakemania.ng/admin/categories/add-cat');
}));
exports.addCategory = addCategory;
const getEditCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const categoryID = req.params.id;
        const userID = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userID;
        if (!userID) {
            res.json({ status: "failed", message: "unauthoried" });
        }
        //   const categories = await Categories.findAll()
        const category = yield categoryModel_1.default.findByPk(categoryID);
        if (!category) {
            return res.status(404).json({ message: 'Category does not exist' });
        }
        res.render('admin/edit-cat', { category, currentPage: 'edit-cake' });
    }
    catch (error) {
        console.error('Error updating cake:', error);
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
    const { categoryName, categoryID } = req.body;
    const category = yield categoryModel_1.default.findByPk(categoryID);
    /**
     OR:
     const category = Categories.findByPk(req.params.id)
     */
    if (category) {
        yield category.destroy();
        // res.status(200).json({ status: "success", message: 'Category deleted' });
        res.render('cakemania.ng/admin/categories');
    }
    else {
        res.status(404).json({ message: 'category not found' });
    }
    res.status(200).json({ message: `category ${categoryName} with id ${categoryID} has been removed` });
}));
exports.removeCategory = removeCategory;
