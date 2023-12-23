import { Request, Response,} from "express";
import Categories from "../models/categorymodel";


const getAllCategories = (async(req:Request , res:Response )=> {
    const allCategories = await Categories.findAll({})
    if(!allCategories){
        res.status(404).send("NO CATEGORIES FOUND")
    }

    res.status(200).render('index', { allCategories, currentPage: 'index' })
})


const getCategory = (async(req:Request , res:Response )=> {

    // const {categoryName, categoryID} = req.body

    // const category = Categories.findOne({
    //     where: {
    //         categoryName: categoryName
    //     }
    // })

const category = await Categories.findByPk(req.params.id)

    if(!category){
        res.status(400).send("CATEGORY DOES NOT EXIST")
    }
    res.status(200).json(category)
})

const addCategory = (async(req:Request , res:Response )=> {
    const {categoryName, categoryImage} = req.body

    const existingCategory = await Categories.findOne({
        where: {
            categoryName: categoryName
        }
    })
    /*
     const existingCategory = Categories.findByPk(categoryID)
    */

    if(existingCategory){
        res.status(400).json({ status: "failed", message: "Category already exists"})
    }
    const newCategory = await Categories.create(req.body)
    
    res.status(200).json({ status: "successful", category: newCategory})
})


export async function editCategory(req:Request, res:Response) {

    try {
        const category = await Categories.findByPk(req.params.id);

    if (category) {

        await category.update(req.body);
        res.status(200).json({ status: "category edited successfully", category});
    } else {
        res.status(404).json({ message: 'User not found' });
    }

    } catch (error) {
        res.status(500).json({ message: 'server error'})
    } 
};


const removeCategory = (async(req:Request , res:Response )=> {
    const {categoryName, categoryID} = req.body
    const category = await Categories.findByPk(categoryID)
    /**
     OR:
     const category = Categories.findByPk(req.params.id)
     */
     if (category) {
        await category.destroy();
        res.status(200).json({ status: "success", message: 'Category deleted' });
    } else {
        res.status(404).json({ message: 'category not found' });
    }
    
    res.status(200).json({message: `category ${categoryName} with id ${categoryID} has been removed`})
})

export {
    removeCategory,
    addCategory,
    getAllCategories,
    getCategory
}
    
