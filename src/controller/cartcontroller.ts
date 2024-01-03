//CART CONTROLLER - REDONE

import { Request, Response,} from "express";
import Cart from "../models/cartmodel"
import Cakes from "../models/cakemodel";
interface AuthRequest extends Request {
    user?: { userID: string, isAdmin: boolean };
  }


async function addToCart(cartID: string, userId: string, cakeId : string, cakeQuantity: number, size: string ){
    try {



        let specifiedCake = await Cakes.findByPk(cakeId)
        if(!specifiedCake){
            throw new Error(`Cake not found`)
        }
        let cakePrice = specifiedCake.dataValues.price
        
        //cartItem checks that that specific cake has been added by a specific user
        let cartItem = await Cart.findOne({where: 
            {cakeID: specifiedCake.dataValues.cakeID,
            userID:userId}
        })
        //If the cake is already in the cart, just increase the quantity
        if(cartItem){
            cartItem.dataValues.quantity += cakeQuantity
            let tempPrice= (parseFloat(cakePrice.split(",").join(""))) * (cartItem.dataValues.quantity)

            
            cartItem.dataValues.price = tempPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            //Price function would change depending on size. consider using a switch statement
            await cartItem.save()
        } else{
            //if the cake is not in the cart, create a new one.
            let tempcartPrice = (Number(cakePrice.split(",").join(""))) * cakeQuantity
            let cartPrice = tempcartPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            cartItem = await Cart.create({
                cartID,
                userID: userId,
                cakeID: cakeId,
                size: size,
                quantity : cakeQuantity,
                price: cartPrice

            })
        }
        return cartItem
    } catch (error) {
        console.error('Error adding to cart', error)
    }
}

/*
req: AuthRequest
const userID = req.user?.userID;
const userID = req.cookies.token
*/


const addCakeToCart =  async(req: AuthRequest, res:Response)=>{
    try{ 
        
        
        const userID = req.user?.userID;
        const { ...cartID} = req.body

        if(!userID){
            res.status(401).json({error: "unauthorized. please log in"}).redirect("/login")
            throw Error(`User not logged in`)
        }
        const cakeID = req.params.id
        const quantity = req.body.quantity
        const size = req.body.size
        const specificCake = Cakes.findByPk(cakeID)
        //const cakeID = specificCake.cakeID
        const cartItem = await addToCart(cartID, userID, cakeID, quantity, size)

        res.status(200).send(`Cake Added to Cart`)
    } catch(error){
        res.status(500).send(`Cake not added to Cart`)
    }
}

const getUserCart = async(req: AuthRequest, res:Response)=>{
    try {
        const userID = req.user?.userID;
    if(!userID){
        res.status(401).json({error: "unauthorized. please log in"}).redirect("/login")
        throw Error(`User not logged in`)
    }
    const userCart = await Cart.findOne({where:{userID: userID}})
    return userCart
    } catch (error) {
        res.status(400).json({message: "Error getting cart"})
        console.log(error);
    }
    

}


const removeCakeFromCart =  async(req: Request, res:Response)=>{
    try{
        const nameOfCake = req.body.cakeName
        
        const specificCake = await Cakes.findOne({where: {cakeName:nameOfCake}})
        if(!specificCake){
            throw new Error(`Cake not found`)
        }

        const cakeid = specificCake.dataValues.cakeID

        let cartItem = await Cart.findOne({where: {cakeID: cakeid}})
        //find the cake and if it is already in the cart, just remove it. else (throw and error)
        if(cartItem){
            await cartItem.destroy()
        
        } else{
            throw new Error (`Cake not in cart`)
            
        }
        
        res.status(200).send(`Cake removed from Cart`)
    } catch(error){
        res.status(500).send(`Cake not removed from Cart`)
    }
}


export {addToCart, addCakeToCart,removeCakeFromCart, getUserCart,}