import { RequestHandler, Request, Response } from 'express';
import Cakes from '../models/cakemodel'; // Import cake models
import { ZodError } from 'zod';
  
import { validationSchemas } from '../validation/validate';

const { cakeSchema } = validationSchemas;
import { authorize } from '../middleware/authorize';


interface AuthRequest extends Request {
  user?: { userID: string }; // Add the user property
}


export const findAllCakes: RequestHandler = async (req: Request, res: Response) => {
  try {
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

    res.status(200).json({ status: 'Cake updated successfully', cake });
  } catch (error) {
    console.error('Error updating cake:', error);
    res.status(500).json({ message: 'Failed to update cake', error });
  }
};

export const deleteCake: RequestHandler = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const cake = await Cakes.findByPk(id);
    if (!cake) {
      return res.status(404).json({ message: 'Cake Not Found' });
    }

    await cake.destroy();

    res.status(204).json({ cake, status: 'Cake deleted successfully' });
  } catch (error) {
    console.error('Error deleting cake:', error);
    res.status(500).json({ message: 'Failed to delete cake', error });
  }
};


export const getCakesByCategory: RequestHandler = async (req: Request, res: Response) => {
  
  const categoryID = req.params.categoryid;

  try {
    // Find cakes by category ID
    const cakes = await Cakes.findAll({
      where: { category: categoryID },
    });

    if(!cakes){
      // res.json({ status: "successful", message: "No cakes in this category"})
      res.status(400).render('products', { message: "no cakes available in this category"});

    }

    res.status(200).render('products', { cakes, currentPage: 'products'});
  } 
  catch (error) {
    console.error('Error fetching cakes by category:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

};


