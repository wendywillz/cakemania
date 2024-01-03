import { Request, Response, NextFunction } from "express";
import Users from "../models/usermodel";
import Categories from "../models/categoryModel";
import { getAllCategories } from "./categorycontroller";


interface AuthRequest extends Request {
    user?: { userID: string, isAdmin: boolean }; // Add the user property
  }


export async function getUserNavbar(req:Request, res:Response) {
    try {

    const userInfo = await req.cookies.user

    res.locals.userDetails = userInfo ? JSON.parse(userInfo) : null;

    const allCategories = await Categories.findAll({})
    if(!allCategories){
        res.status(404).send("NO CATEGORIES FOUND")
    }

    res.render('index', { allCategories, currentPage: 'index' })

    
    } catch (error) {
        res.render('index', { currentPage: 'index', userDetails: null} )
    }
};  


// export  function logout(req: AuthRequest, res: Response) {
//     try {
//       res.clearCookie('token');
//       res.clearCookie('user');


//       res.redirect('/cakemania.ng');
//     } catch (error) {
//       console.error('Error during logout:', error);
//       res.status(500).send('Internal Server Error');
//     }
//   }