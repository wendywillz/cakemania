
import { Request, Response,} from "express";
import Cart from "../models/cartmodel"
import Cakes from "../models/cakemodel";
import UserCart  from "../models/userCartModel";

interface AuthRequest extends Request {
    user?: { userID: string, isAdmin: boolean };
  }

  interface CartWithCake extends Cart {
    Cake: Cakes;
}

const createUserCart = async (req:AuthRequest, res:Response)=>{
    const specificUserID = req.user?.userID;
    if (!specificUserID) {
        res.status(401).redirect("/cakemania.ng/users/login");
        throw Error(`User not logged in`);
    } 
   
    const allUserCarts = await Cart.findAll({where:{userID: specificUserID}})
    console.log(allUserCarts);

    
        for(let userCart of allUserCarts){
            await UserCart.create({
                userID: userCart.dataValues.userID, 
                cartID: userCart.dataValues.cartID 
            })
        }
    
    
}
////////////////////////////////////////////////////////////////////////////////////////////////////
//GET USER CARTS
async function getUserCart(userId: string){
    const allCartItems = await UserCart.findAll({where:{userID: userId}})
}


const getOrderItems = async (req:AuthRequest, res:Response)=>{
    const specificUserID = req.user?.userID;
    if (!specificUserID) {
        res.status(401).redirect("/cakemania.ng/users/login");
        throw Error(`User not logged in`);
    } 

    const allOrderITems = await getUserCart(specificUserID)
    return allOrderITems

}

////////////////////////////
//DELETE  ALL USER CARTS
const deleteUserCart = async (req:AuthRequest, res:Response)=>{
    const specificUserID = req.user?.userID;
   
    const allUserCarts = await Cart.findAll({where:{userID: specificUserID}})
    console.log(allUserCarts);

    
        for(let userCart of allUserCarts){
            await userCart.destroy()
        }
    
}

export {deleteUserCart, createUserCart}
