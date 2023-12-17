import { Request, Response } from 'express';
import Orders from '../models/ordermodel';

import { validationSchemas } from '../validation/validate';

const { orderSchema } = validationSchemas;

import { z, ZodError } from 'zod';



export const orderCake = async (req: Request, res: Response) => {
    try {
        const validation = orderSchema.parse(req.body);

        const { total, status, deliveryPhoneNo, deliveryAddress, deliveryState, deliveryLga, additionalInfo } = validation;

    
        const orderedCake = await Orders.create(validation);

        res.status(201).json(orderedCake);
        

    } catch (error) {
        if (error instanceof ZodError) {
          const formattedErrors = error.errors.map((err) => ({
            path: err.path.join("."),
            message: err.message,
          }));
          return res.status(400).json({
            status: "failed",
            message: "Validation errors",
            errors: formattedErrors,
          });
        } else {
          console.error("Error creating cake", error);
          return res
            .status(500)
            .json({ status: "error", message: "Internal server error" });
        }
      }
}
