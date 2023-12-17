import { RequestHandler, Request, Response } from 'express';
import Cakes from '../models/cakemodel'; // Import cake models
import { ZodError } from 'zod';
  
import { validationSchemas } from '../validation/validate';

const { cakeSchema } = validationSchemas;

export const createCake: RequestHandler = async (req: Request, res: Response) => {
  try {
    const validation = cakeSchema.parse(req.body);
    
    const{
      cakeName,
      cakeID,
      category,
      description,
      image,
      flavour,
      price,
      rating,
      comments,
      numReviews,
    } = validation;

    // Create a cake
    const cake = await Cakes.create({
      cakeName,
      cakeID,
      category,
      description,
      image,
      flavour,
      price,
      rating,
      comments,
      numReviews,
    });

    return res.status(201).json({ cake, status: 'Cake created successfully' });
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

export const findAllCakes: RequestHandler = async (req: Request, res: Response) => {
  try {
    const cakes = await Cakes.findAll();
    res.status(200).json({ cakes, status: 'success' });
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

export const findCakeById: RequestHandler = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const cake = await Cakes.findByPk(id);

    if (!cake) {
      return res.status(404).json({ message: 'Cake Not Found' });
    }

    res.status(200).json({ status: 'success', cake });
  } catch (error) {
    console.error('Error fetching cake:', error);
    res.status(500).json({ message: 'Failed to fetch cake', error });
  }
};

export const updateCake: RequestHandler = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const cake = await Cakes.findByPk(id);
    if (!cake) {
      return res.status(404).json({ message: 'Cake Not Found' });
    }

    await cake.update({ ...req.body });

    res.status(200).json({ cake, status: 'Cake updated successfully' });
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
