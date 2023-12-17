import Users from "../models/usermodel";
import express, { Request, Response, NextFunction } from "express";

const authUser = 
(async(req: Request, res:Response, next: NextFunction)=>{
    const id = req.body.userID
    if(!id){
        res.status(400).send("")
    }
    const user = await Users.findByPk(id)
    if (!user) {
        res.status(401).send("<h1> Not a user. Please sign up </h1>")

        //res.redirect(/home/register) // not sure of the specific route nor whether or not I should redirect.
      }
  
      next()
})

const authAdmin = (async(req: Request, res:Response, next: NextFunction)=>{
    const id = req.body.userID
    const user = await Users.findByPk(id)
    if (!user) {
        res.status(401).send("<h1> Not a user. Please sign up </h1>")
    }
    if (user.isAdmin !== true) {
        res.status(401).send("<h1> You do not have permisson </h1>")
      }
  
      next()
})





export {
    authAdmin,
    authUser
}

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