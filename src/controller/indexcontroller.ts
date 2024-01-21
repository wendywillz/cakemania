import { Request, Response, NextFunction } from "express";
import Users from "../models/usermodel";
import Categories from "../models/categoryModel";
import Cart from "../models/cartmodel";



interface AuthRequest extends Request {
    user?: { userID: string, isAdmin: boolean }; // Add the user property
  }


export async function getUserNavbar(req:Request, res:Response) {

    try {

    const userInfo = await req.cookies?.user


    if(! userInfo){
      const allCategories = await Categories.findAll()
    return res.render('index', { allCategories: allCategories, currentPage: 'index' })
    }

    else{

     res.locals.userDetails = userInfo ? JSON.parse(userInfo) : null;

    const userCart = 
    JSON.parse(userInfo).userID ? await Cart.findAll({
      where: { userID: JSON.parse(userInfo).userID },
    })
  : null;

  res.locals.userCart = userCart

    const allCategories = await Categories.findAll()

    res.render('index', { allCategories: allCategories || [], currentPage: 'index' })
    }

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