import { Request, Response } from 'express';
import Orders from '../models/ordermodel';
import  orderSchema  from '../validation/validate'
import { z } from 'zod';



export const orderCake = async (req: Request, res: Response) => {
    try {
        const { total, status, deliveryPhoneNo, deliveryAddress, deliveryState, deliveryLga, additionalInfo } = req.body;

        const validateOrder = orderSchema.parse({
            orderID: req.body.orderID,
            total,
            status,
            deliveryPhoneNo,
            deliveryAddress,
            deliveryState, 
            deliveryLga,
            additionalInfo
        });
        const orderedCake = await Orders.create(validateOrder);

        res.status(201).json(orderedCake);
        

    } catch (error) {
        console.error('Error ordering a cake: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
