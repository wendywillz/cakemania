import { Request, Response, NextFunction } from "express";
import Users from "../models/usermodel";
import Orders from "../models/ordermodel";
import { ZodError, z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { validationSchemas } from "../validation/validate";

interface AuthRequest extends Request {
  user?: { userID: string, isAdmin: boolean }; // Add the user property
}

const {
  signupSchema,
  loginSchema,
  cakeSchema,
  categorySchema,
  orderItemsSchema,
  orderSchema,
} = validationSchemas;

export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    const validation = signupSchema.parse(req.body);

    const {
      firstName,
      userID,
      lastName,
      email,
      password,
      passwordConfirm,
      phoneNo,
      isAdmin,
    } = validation;

    const hashedPassword = await bcrypt.hash(password, 10);

    //check if user already exists by checking to see if the email exists in our database already
    const existingUser = await Users.findOne({ where: { email } });

    if (existingUser) {
      return res
        .render('signup', {
          currentPage: 'signup',
          message: "Email is already in use, try another email",
          successMessage: ''
        });
    }
    const newUser = await Users.create({
      firstName,
      lastName,
      userID,
      email,
      password: hashedPassword,
      // passwordConfirm: hashedPassword,
      phoneNo,
      isAdmin,
    });

    if (!newUser) {
      return res.render('signup', {
        currentPage: 'signup',
        message: "Invalid details, account cannot be created",
        successMessage: ''
      });
    }

    return res.render('signup',{ currentPage: 'signup', message: "", successMessage: 'Your account has been successfully created, login' });
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = error.errors.map((err) => (err.message
      ));
      return res.render('signup', {
        currentPage: "signup",
        message: formattedErrors.join(''),
        successMessage: ''
      });
    } else {
      console.error("Error creating user:", error);
      return res
        .status(500)
        .render('signup', {  currentPage: 'signup', message: "Internal server error" });
    }
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  
    try {
      const validation = loginSchema.parse(req.body);
      const { email, password } = validation;

      // Find the user by email
      const user = await Users.findOne({
        where: { email },
        attributes: [ "isAdmin", "userID", "email", "password"],
      });

      if (!user) {
        return res.render('login', { message: "Invalid email, user does not exist", currentPage: 'login'})
       
      }
      // Compare the provided password with the hashed password in the database, If passwords match, the login is successful
      if (
        user &&
        bcrypt.compareSync(password, user.dataValues.password as string)
      ) {
        const secret: any = process.env.secret;
        // create secret token for authenticated users
  
        const token = jwt.sign({ loginkey: user.dataValues.userID,
          isAdmin: user.dataValues.isAdmin }, secret, { expiresIn: "1h" }
        );    
        res.cookie('token', token, { httpOnly: true, secure: true });

        if(user.dataValues.isAdmin === true){
            // res.json({ status: "WELCOME ADMIN", token: token})
            res.redirect('/cakemania.ng/admin/dashboard')
        }
        else{
            // res.json({ status: "user successfully logged in", token: token})
            res.redirect('/cakemania.ng/users/profile')
        }
    
      } else {
        // If passwords don't match, return an error
        return res
          .render('login', { message: "Incorrect password", currentPage: 'login' });
          // .json({ status: "failed", message: "Invalid password" });
      }
    }

    catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => (err.message
        ));
        return res.render('login', {
          currentPage: "login",
          message: formattedErrors.join('')
        });
      } else {
        console.error("Error creating user:", error);
        return res
          .status(500)
          .render('login', {  currentPage: 'login', message: "Internal server error" });
      }
    }
  
  }


export async function getUserDashboard(req:AuthRequest, res:Response, next:NextFunction) {
    try {

      const userID = req.user?.userID;

      const user = await Users.findAll({
        where: { userID: userID, isAdmin: false }, // Adjust the column name according to your database schema
      });

      // Fetch products by user ID
      const userOrders = await Orders.findAll({
        // where: { userID: userID }, // Adjust the column name according to your database schema
      });

      // res.json({ status: "successful", message: "welcome customer"})
      res.render('users/user-dashboard', { user, userOrders, currentPage: "user-dashboard" })
       
        
    } catch (error) {
        res.status(500).json({ message: 'server error'})
    }
};  

export async function getAllUsers(req:Request, res:Response, next:NextFunction) {

    try {
        const users = await Users.findAll({
            attributes: {
              exclude: ['password', 'passwordConfirm'] // Exclude the 'password' column from the result
            }
          });
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ message: 'server error'})
    }
};

export async function getUserByID(req:Request, res:Response, next:NextFunction) {
  
    try {
        const user = await Users.findByPk(req.params.id,  {
          attributes: { exclude: ['password'] }, 
          
        });
        if (user) {
            res.status(200).json(user)
        } else {
            res.status(404).json({ message: 'User not found' });
        }
        
    } catch (error) {
        res.status(500).json({ message: 'server error'})
    }
};

export async function getEditUser(req:Request, res:Response, next:NextFunction) {

  try {
      const user = await Users.findByPk(req.params.id,  {
        attributes: { exclude: ['password'] }, 
        
      });
      if (user) {
          res.render('users/user-edit-profile', { user, currentPage: 'user-dashboard'})
      } else {
          res.render('users/user-edit-profile', { message: "user does not exist", currentPage: 'user-dashboard'})
      }
      
  } catch (error) {
      res.status(500).json({ message: 'server error'})
  }
};

export async function editUser(req:Request, res:Response, next:NextFunction) {
    try {
        const user = await Users.findByPk(req.params.id);
    if (user) {
        await user.update(req.body);
        res.status(200).json({ status: "user edited successfully", user});
    } else {
        res.status(404).json({ message: 'User not found' });
    }

    } catch (error) {
        res.status(500).json({ message: 'server error'})
    } 
};

export async function deleteUser(req:Request, res:Response, next:NextFunction) {
    try {
        const user = await Users.findByPk(req.params.id);
    if (user) {
        await user.destroy();
        res.status(200).json({ status: "success", message: 'User deleted' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
    } catch (error) {
        res.status(500).json({ message: 'server error'})
    }
};

export async function getUserOrders(req:AuthRequest, res:Response, next:NextFunction) {
  try {

    const userID = req.user?.userID;

    const user = await Users.findAll({
      where: { userID: userID, isAdmin: false }, // Adjust the column name according to your database schema
    });

    console.log(user)


    // Fetch products by user ID
    const userOrders = await Orders.findAll({
      // where: { userID: userID }, // Adjust the column name according to your database schema
    });

    // res.json({ status: "successful", message: "welcome customer"})
    res.render('users/user-orders', { user, userOrders, currentPage: "user-dashboard" })
     
      
  } catch (error) {
      res.status(500).json({ message: 'server error'})
  }
};  
