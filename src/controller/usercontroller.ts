import { Request, Response, NextFunction } from "express";
import Users from "../models/usermodel";
import { ZodError, z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { validationSchemas } from "../validation/validate";

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
        .status(400)
        .json({
          status: "failed",
          message: "Email is already in use, try another email",
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
      return res.status(400).json({
        status: "failed",
        message: "Invalid details, account cannot be created",
      });
    }

    return res.status(200).json({ status: "account created", user: newUser });
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
      console.error("Error creating user:", error);
      return res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    }
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {

    const validation = loginSchema.parse(req.body);
    const { email, password } = validation;
  
    try {

      // Find the user by email
      const user = await Users.findOne({
        where: { email },
        attributes: [ "isAdmin", "userID", "email", "password"],
      });

      // If the user is not found, return an error
      if (!user) {
        return res.json({status: "failed, user does not exist"})
          // .json({ status: "failed", message: "User not found" });
      }
      // Compare the provided password with the hashed password in the database, If passwords match, the login is successful
      if (
        user &&
        bcrypt.compareSync(password, user.dataValues.password as string)
      ) {
        const secret: any = process.env.secret;
        // create secret token for authenticated users
  
        const token = jwt.sign({ loginkey: user.dataValues.userID, }, secret, { expiresIn: "1h" }
        );    
        res.cookie('token', token, { httpOnly: true, secure: true });

        if(user.dataValues.isAdmin === true){
            res.json({ status: "WELCOME ADMIN", token: token})
        }
        else{
            res.json({ status: "user successfully logged in", token: token})
        }

        // res.status(200).redirect('/store/products/myprofile')
    
      } else {
        // If passwords don't match, return an error
        return res
          .status(401)
          .json({ status: "failed", message: "Invalid password" });
      }
    }catch (error) {
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
          console.error("Error logging in:", error);
          return res
            .status(500)
            .json({ status: "error", message: "Internal server error" });
        }
      }
  }


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