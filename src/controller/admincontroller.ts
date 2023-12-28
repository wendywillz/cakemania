import { RequestHandler, Request, Response, NextFunction } from "express";
import Users from "../models/usermodel";
import Cakes from "../models/cakemodel";
import Categories from "../models/categorymodel";
import { validationSchemas } from '../validation/validate';
import { ZodError } from 'zod';


const { cakeSchema } = validationSchemas;

interface AuthRequest extends Request {
    user?: { userID: string }; // Add the user property
  }



export async function getAdminDashboard(req: AuthRequest, res: Response){
  
    try {
      // Assuming you have user information available in req.user after authentication
      const userID = req.user?.userID;

      const categories = await Categories.findAll();

  
      const admin = await Users.findAll({
        where: { userID: userID, isAdmin: true }, // Adjust the column name according to your database schema
      });


      // Fetch products by user ID
      const adminCakes = await Cakes.findAll({
        where: { userID: userID }, // Adjust the column name according to your database schema
      });
  
      // Render the products page with the fetched data
      res.render('admin/index', { categories, admin, adminCakes});
    } catch (error) {
      // Handle errors appropriately
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


  const userID = req.user?.userID

  try {

  if(userID == undefined){
      return res.status(401).json({message: "unathourized"})
    }
  // Create a cake
  const cake = await Cakes.create({
    cakeName, cakeID, category, description, image, flavour,price, rating, comments, numReviews,userID
  });

  return res.status(201).json({ status: 'Cake created successfully', cake,  });
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