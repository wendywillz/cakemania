import { RequestHandler, Request, Response, NextFunction } from "express";
import Users from "../models/usermodel";
import Cakes from "../models/cakemodel";
import Categories from "../models/categoryModel";
import { validationSchemas } from '../validation/validate';
import { ZodError } from 'zod';
import { Sequelize } from "sequelize";


const { cakeSchema } = validationSchemas;

interface AuthRequest extends Request {
  user?: { userID: string, isAdmin: boolean }; // Add the user property
}



export async function getAdminDashboard(req: AuthRequest, res: Response){
  
    try {
      // Assuming you have user information available in req.user after authentication
      const userID = req.user?.userID;

      const categories = await Categories.findAll();

  
      const admin = await Users.findAll({
        where: { userID: userID, isAdmin: true },
         // Adjust the column name according to your database schema
      });


      // Fetch products by user ID
      const adminCakes = await Cakes.findAll({
        where: { userID: userID },
        
      });

      const adminCategories = await Categories.findAll({
        where: {
          categoryID: adminCakes.map(cake => cake.dataValues.category),
        },
      });
  
      // Render the products page with the fetched data
      res.render('admin/index', { categories, admin, adminCakes, adminCategories});
    } catch (error) {
      // Handle errors appropriately
      res.status(500).send('Internal Server Error');
    }
}

export  function logout(req: AuthRequest, res: Response) {
  try {
    res.clearCookie('token');
    res.status(200).redirect('/cakemania.ng/users/login');
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).send('Internal Server Error');
  }
}


export async function getAdminCakes(req: AuthRequest, res: Response){
  
  try {
    // Assuming you have user information available in req.user after authentication
    const userID = req.user?.userID;

    const admin = await Users.findAll({
      where: { userID: userID, isAdmin: true }, // Adjust the column name according to your database schema
    });


    // Fetch products by user ID
    const adminCakes = await Cakes.findAll({
      where: { userID: userID }, // Adjust the column name according to your database schema
    });

    // Render the products page with the fetched data
    res.render('admin/cake-page', { admin, adminCakes});
  } catch (error) {
    // Handle errors appropriately
    res.status(500).send('Internal Server Error');
  }
}

export async function getAdminCategories(req: AuthRequest, res: Response){
  
  try {
    // Assuming you have user information available in req.user after authentication
    const userID = req.user?.userID;

    const admin = await Users.findAll({
      where: { userID: userID, isAdmin: true }, // Adjust the column name according to your database schema
    });


    // Fetch products by user ID
    const adminCakes = await Cakes.findAll({
      where: { userID: userID }, // Adjust the column name according to your database schema
    });

    const categories = await Categories.findAll();

    // Render the products page with the fetched data
    res.render('admin/category-page', { admin, adminCakes, categories});
  } catch (error) {
    // Handle errors appropriately
    res.status(500).send('Internal Server Error');
  }
}


export const createCake: RequestHandler = async (req: AuthRequest, res: Response) => {


  const validation = cakeSchema.parse(req.body);

  const{ cakeName, cakeID, category, description, image, flavour,price, rating, comments, numReviews,} =  validation;

  const categoryValue = parseInt(req.body.category, 10);


  const userID = req.user?.userID

  try {

  if(userID == undefined){
      return res.status(401).json({message: "unathourized"})
    }
  // Create a cake
  const cake = await Cakes.create({
    cakeName, cakeID, category: categoryValue, description, image, flavour,price, rating, comments, numReviews,userID
  });

  // return res.status(201).json({ status: 'Cake created successfully', cake,  });

  return res.status(201).redirect('/cakemania.ng/admin/cakes')

} catch (error) {
  if (error instanceof ZodError) {
    const formattedErrors = error.errors.map((err) => ({
      path: err.path.join('.'),
      message: err.message,
    }));
    return res.status(400).json({
      status: 'failed',
      message: 'Validation errors',
      errors: formattedErrors,
    });
  } else {
    console.error('Error creating cake:', error);
    res.status(500).json({ message: 'Failed to create cake', error });
  }
}
};


export const getUpdateCake: RequestHandler = async (req: AuthRequest, res: Response) => {
  try {
    const cakeID = req.params.id;

    const userID = req.user?.userID

    if(!userID){
      res.json({ status: "failed", message: "unauthoried"})
    }

    const categories = await Categories.findAll()

    const cake = await Cakes.findByPk(cakeID);

    if (!cake) {
      return res.status(404).render('admin/edit-cake',{ message: 'Cake Not Found' });
    }

    res.render('admin/edit-cake', { cake, categories, currentPage: 'edit-cake' });



  } catch (error) {
    console.error('Error updating cake:', error);
    res.status(500).json({ message: 'Failed to update cake', error });
  }
};


export const updateCake: RequestHandler = async (req: AuthRequest, res: Response) => {
  try {
    const cakeID = req.params.id;

    const userID = req.user?.userID

    if(!userID){
      res.json({ status: "failed", message: "unauthoried"})
    }

    const cake = await Cakes.findByPk(cakeID);
    if (!cake) {
      return res.status(404).json({ message: 'Cake Not Found' });
    }

    await cake.update({ ...req.body });

    // res.status(200).json({ status: 'Cake updated successfully', cake });

    res.redirect('/cakemania.ng/admin/cakes')
  } catch (error) {
    console.error('Error updating cake:', error);
    res.status(500).json({ message: 'Failed to update cake', error });
  }
};


export const deleteCake: RequestHandler = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id;

    console.log(id)

    const cake = await Cakes.findByPk(id);
    if (!cake) {
      return res.status(404).json({ message: 'Cake Not Found' });
    }

    console.log("my cake is detroying")
    await cake.destroy();

    console.log("my cake has destroyed")

    return res.redirect('/cakemania.ng/admin/cakes')

  } catch (error) {
    console.error('Error deleting cake:', error);
    res.status(500).json({ message: 'Failed to delete cake', error });
  }
};


