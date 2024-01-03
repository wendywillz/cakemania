import Users from "../models/usermodel";
import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


interface AuthRequest extends Request {
    user?: { userID: string, isAdmin: boolean }; // Add the user property
  }


export const authorize = async (req: AuthRequest, res: Response, next: NextFunction) => {
  
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
    // const token = req.cookies.token

  
    if (!token) {
      return res.redirect('/cakemania.ng/users/login')
        //return res.redirect('/cakemania.ng/users/login')

    }
  
    try {

     const secret: any = process.env.secret
        
      const decoded = jwt.verify(token, secret) as { loginkey: string; isAdmin: boolean };
  
      // Use Sequelize's findOne method to retrieve the user
      const user = await Users.findOne({
        where: { userID: decoded.loginkey },
        attributes: ['userID', 'isAdmin'],
      });

  
      if (!user || user.dataValues.userID ==  null) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
  
      req.user = { userID: user.dataValues.userID, isAdmin: user.dataValues.isAdmin }; // Attach the user to the request for further use
      next();
  
    } catch (error) {
      console.error(error);
      res.render('login', { currentPage: 'login', message: 'Kindly login, your session has expired' });
    }
  };


  export const adminAuthorization = async (req: AuthRequest, res: Response, next: NextFunction) => {
  
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
    // const token = req.cookies.token
  
    try {

     const secret: any = process.env.secret
        
      const decoded = jwt.verify(token, secret) as { loginkey: string; isAdmin: boolean };

      // Use Sequelize's findOne method to retrieve the user
     if(decoded.isAdmin === false){
      // return res.redirect('/cakemania.ng/users/login')
      res.json({status: "failed", message: "You are not an admin"})
     }
      next();
  
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'error in authorization' });
    }
  };


export function noCache(req:AuthRequest, res:Response, next:NextFunction) {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
}































// const authUser = 
// (async(req: Request, res:Response, next: NextFunction)=>{
//     const id = req.body.userID
//     if(!id){
//         res.status(400).send("")
//     }
//     const user = await Users.findByPk(id)
//     if (!user) {
//         res.status(401).send("<h1> Not a user. Please sign up </h1>")

//         //res.redirect(/home/register) // not sure of the specific route nor whether or not I should redirect.
//       }
  
//       next()
// })

// const authAdmin = (async(req: Request, res:Response, next: NextFunction)=>{
//     const id = req.body.userID
//     const user = await Users.findByPk(id)
//     if (!user) {
//         res.status(401).send("<h1> Not a user. Please sign up </h1>")
//     }
//     if (user?.dataValues.isAdmin !== true) {
//         res.status(401).send("<h1> You do not have permisson </h1>")
//       }
  
//       next()
// })



// export {
//     authAdmin,
//     authUser
// }

/*

const user = await Users.findOne({
        where :{
            userID: id,
        }
    })

*/

/*
const canAddtoCart = (async(req: Request, res:Response, next: NextFunction)=>{
    const id = req.body.userID
    const user = await Users.findByPk(id)
    if (!user) {
        res.status(401).send("<h1> Not a user. Please sign up </h1>")

        //res.redirect(/home/register) // not sure of the specific route nor whether or not I should redirect.
      }
  
      next()
})
*/