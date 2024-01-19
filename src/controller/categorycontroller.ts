import { RequestHandler, Request, Response,} from "express";
import Categories from "../models/categoryModel";
import { validationSchemas } from "../validation/validate";
import { ZodError, z } from "zod";



const { signupSchema, loginSchema, cakeSchema, categorySchema, orderItemsSchema, orderSchema } = validationSchemas;

interface AuthRequest extends Request {
  user?: { userID: string, isAdmin: boolean }; // Add the user property
}



// const getAllCategories = (async(req:Request , res:Response )=> {
//     const allCategories = await Categories.findAll({})
//     if(!allCategories){
//         res.status(404).send("NO CATEGORIES FOUND")
//     }

//     res.render('index', { allCategories, currentPage: 'index' })
// })


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

  try {

    console.log(req.body)
    console.log(req.file)

    const validation = categorySchema.parse(req.body);


    const { categoryName } = validation
    const categoryImage = req.file?.filename
 
    const existingCategory = await Categories.findOne({
        where: {
            categoryName: categoryName
        }
    })
    if(existingCategory){
        res.render('admin/add-cat', { message: "Category already exists", successMessage: ''})
    }

    if( req.file === undefined){
      res.json({ message: "No file uploaded"})
    }

    else{

      const newCategory = await Categories.create({
        categoryName: categoryName,
        categoryImage: req.file.filename
      });

      res.render('admin/add-cat', { successMessage: "Category has been successfully added", message: ''})
      // res.redirect('/cakemania.ng/admin/categories')

    }
    
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = error.errors.map((err) => (err.message
      ));
      console.log(error)
      console.log(formattedErrors)
      return res.render('admin/add-cat', {
        currentPage: "add-cat",
        message: formattedErrors.join(''),
        successMessage: ''
      });
    } else {
      console.error("Error creating user:", error);
      return res
        .status(500)
        .render('admin/add-cat', {  currentPage: 'add-cat', message: "Internal server error", successMessage: '' });
    }
  }
    
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

        return res.render('admin/edit-cat', { message: 'Category does not exist' })
      }

      res.render('admin/edit-cat', { category, currentPage: 'edit-cat' });
  
  
  
    } catch (error) {
      
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

  try {
    const categoryID = req.params.id
    const categories = await Categories.findAll()
    
    const category = await Categories.findByPk(categoryID)
    /**
     OR:
     const category = Categories.findByPk(req.params.id)
     */
     if (category) {
        await category.destroy();
        res.render('admin/category-page', {categories, message: "Category has been removed" })

        // res.redirect('/cakemania.ng/admin/categories')
    } else {
      res.render('admin/category-page', {categories, message: "Category does not exist" })
    }
    
  } catch (error) {
    // res.render('admin/category-page', { message: "failed, incorrect details", successMessage: ''})

    
  }

    
    
})

export {
    removeCategory,
    addCategory,
    getCategory
}
    
