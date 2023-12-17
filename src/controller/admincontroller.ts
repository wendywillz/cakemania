import { Request, Response, NextFunction } from "express";
import Users from "../models/usermodel";
import Cakes from "../models/cakemodel";

interface AuthRequest extends Request {
    user?: { userID: string }; // Add the user property
  }



export async function getAdminDashboard(req: AuthRequest, res: Response){
  
    try {
      // Assuming you have user information available in req.user after authentication
      const userID = req.user?.userID;
  
      const user = await Users.findAll({
        where: { userID: userID }, // Adjust the column name according to your database schema
      });
      

      const regularUsers = await Users.findAll({
        where: { isAdmin: false }, // Adjust the column name according to your database schema
      });


      // Fetch products by user ID
      const userProducts = await Cakes.findAll({
        where: { userID: userID }, // Adjust the column name according to your database schema
      });
  
      // Render the products page with the fetched data
      res.render('products-page', { user, userProducts });
    } catch (error) {
      // Handle errors appropriately
      res.status(500).send('Internal Server Error');
    }
  }