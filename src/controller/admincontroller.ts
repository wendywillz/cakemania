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
  
      const admin = await Users.findAll({
        where: { userID: userID, isAdmin: true }, // Adjust the column name according to your database schema
      });


      // Fetch products by user ID
      const adminCakes = await Cakes.findAll({
        where: { userID: userID }, // Adjust the column name according to your database schema
      });
  
      // Render the products page with the fetched data
      res.render('admin-index', { admin, adminCakes});
    } catch (error) {
      // Handle errors appropriately
      res.status(500).send('Internal Server Error');
    }
  }