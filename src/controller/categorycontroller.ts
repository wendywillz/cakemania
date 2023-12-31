import { RequestHandler, Request, Response,} from "express";
import Categories from "../models/categoryModel";


interface AuthRequest extends Request {
  user?: { userID: string, isAdmin: boolean }; // Add the user property
}



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
    
    // res.status(200).json({ status: "successful", category: newCategory})
    res.redirect('/cakemania.ng/admin/categories')
})


export const getEditCategory: RequestHandler = async (req: AuthRequest, res: Response) => {
    try {
      const categoryID = req.params.id;
  
      const userID = req.user?.userID
  
      if(!userID){
        res.json({ status: "failed", message: "unauthoried"})
      }
  
    //   const categories = await Categories.findAll()
  
      const category = await Categories.findByPk(categoryID);

      if (!category) {

        return res.status(404).json({ message: 'Category does not exist' })
      }

  
      res.render('admin/edit-cat', { category, currentPage: 'edit-cake' });
  
  
  
    } catch (error) {
      console.error('Error updating cake:', error);
      res.status(500).json({ message: 'Failed to update cake', error });
    }
  };
  


export async function editCategory(req:AuthRequest, res:Response) {

    try {
        const categoryID = req.params.id;
    
        const userID = req.user?.userID
    
        if(!userID){
          res.json({ status: "failed", message: "unauthoried"})
        }
    
        const category = await Categories.findByPk(categoryID);

        if (!category) {
          return res.status(404).json({ message: 'Category Not Found' });
        }
    
        await category.update({ ...req.body });
    
        // res.status(200).json({ status: 'Cake updated successfully', cake });
        res.redirect('/cakemania.ng/admin/categories')

    } catch (error) {
        res.status(500).json({ message: 'server error'})
    } 
};




const removeCategory = (async(req:Request , res:Response )=> {

    const categoryID = req.params.id
    
    const category = await Categories.findByPk(categoryID)
    /**
     OR:
     const category = Categories.findByPk(req.params.id)
     */
     if (category) {
        await category.destroy();

        // res.status(200).json({ status: "success", message: 'Category deleted' });

        res.redirect('/cakemania.ng/admin/categories')
    } else {
        res.status(404).json({ message: 'category not found' });
    }
    
})

export {
    removeCategory,
    addCategory,
    getAllCategories,
    getCategory
}
    
