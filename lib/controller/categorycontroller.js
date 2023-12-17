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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategory = exports.getAllCategories = exports.addCategory = exports.removeCategory = void 0;
const categoryModel_1 = require("../models/categoryModel");
const getAllCategories = ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allCategories = yield categoryModel_1.Categories.findAll({
        attributes: {
            exlude: ['categoryID']
        }
    });
    if (!allCategories) {
        res.status(404).send("NO CATEGORIES FOUND");
    }
    res.status(200).json(allCategories);
}));
exports.getAllCategories = getAllCategories;
const getCategory = ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryName, categoryID } = req.body;
    const category = categoryModel_1.Categories.findOne({
        where: {
            categoryName: categoryName
        }
    });
    /*
    OR IT COULD BE
    const category = Categories.findByPk(req.params.id)
    */
    if (!category) {
        res.status(400).send("CATEGORY DOES NOT EXIST");
    }
    res.status(200).json(category);
}));
exports.getCategory = getCategory;
const addCategory = ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryName, categoryID } = req.body;
    const existingCategory = categoryModel_1.Categories.findOne({
        where: {
            categoryName: categoryName
        }
    });
    /*
    OR IT COULD BE THIS
     const existingCategory = Categories.findByPk(categoryID)
    */
    if (existingCategory) {
        res.status(400).send("CATEGORY ALREADY EXISTS");
    }
    const newCategory = categoryModel_1.Categories.create(req.body);
    res.status(200).json(newCategory);
}));
exports.addCategory = addCategory;
const removeCategory = ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryName, categoryID } = req.body;
    const category = categoryModel_1.Categories.findByPk(categoryID);
    /**
     OR:
     const category = Categories.findByPk(req.params.id)
     */
    if (!category) {
        res.status(400).send("CATEGORY DOES NOT EXIST");
    }
    yield category.destroy();
    res.status(200).json({ message: `category ${categoryName} with id ${categoryID} has been removed` });
}));
exports.removeCategory = removeCategory;
