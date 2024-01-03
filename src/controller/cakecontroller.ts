import { RequestHandler, Request, Response } from 'express';
import Cakes from '../models/cakemodel'; // Import cake models
import { ZodError } from 'zod';
  
import { validationSchemas } from '../validation/validate';

const { cakeSchema } = validationSchemas;
import { authorize } from '../middleware/authorize';


interface AuthRequest extends Request {
  user?: { userID: string, isAdmin: boolean }; // Add the user property
}


export const findAllCakes: RequestHandler = async (req: Request, res: Response) => {
  try {

    const userInfo = await req.cookies.user

    res.locals.userDetails = userInfo ? JSON.parse(userInfo) : null;
    
    const cakes = await Cakes.findAll();
    res.status(200).json({ status: 'success', cakes  });
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
      console.error('Error fetching cakes:', error);
      res.status(500).json({ message: 'Failed to fetch cakes', error });
    }
  }
};

export const getCakeById: RequestHandler = async (req: Request, res: Response) => {
  try {
    const cakeID = req.params.id;
    const cake = await Cakes.findByPk(cakeID);

    const userInfo = await req.cookies.user

    res.locals.userDetails = userInfo ? JSON.parse(userInfo) : null;

    if (!cake) {
      return res.status(404).json({ message: 'Cake Not Found' });
    }

    // res.status(200).json({ status: 'success', cake });
    res.status(200).render('product-detail', { cake, currentPage: "product-detail" })
  } catch (error) {
    console.error('Error fetching cake:', error);
    res.status(500).json({ message: 'Failed to fetch cake', error });
  }
};


export const getCakesByCategory: RequestHandler = async (req: Request, res: Response) => {


  try {
    const categoryID = req.params.categoryid;

    const userInfo = await req.cookies.user

    res.locals.userDetails = userInfo ? JSON.parse(userInfo) : null;

    
    // Find cakes by category ID
    const cakes = await Cakes.findAll({
      where: { category: categoryID },
    });

    if(!cakes){
      // res.json({ status: "successful", message: "No cakes in this category"})
      res.render('products', { message: "no cakes available in this category"})

    }

    res.status(200).render('products', { cakes, currentPage: 'products'});
  } 
  catch (error) {
    console.error('Error fetching cakes by category:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

};


