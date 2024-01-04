//CART CONTROLLER - REDONE

import { Request, Response,} from "express";
import Cart from "../models/cartmodel"
import Cakes from "../models/cakemodel";
interface AuthRequest extends Request {
    user?: { userID: string, isAdmin: boolean };
  }


async function addToCart(cartID: string, userId: string, cakeId : string, cakeQuantity: number, size: string, cakePrice: string){
    try {

        let specifiedCake = await Cakes.findByPk(cakeId)


        if(!specifiedCake){
            throw new Error(`Cake not found`)
        }

        // let cakePrice = specifiedCake.dataValues.price
        
        //cartItem checks that that specific cake has been added by a specific user
        
        let cartItem = await Cart.findOne({where: 
            {cakeID: specifiedCake.dataValues.cakeID,
            userID:userId},
        })

        console.log(cartItem)

        //If the cake is already in the cart, just increase the quantity
        if(cartItem){

            cartItem.dataValues.quantity += cakeQuantity;

            console.log(cakeQuantity)

            let tempPrice = parseInt(cakePrice.replace(/,/g, '')) * cartItem.dataValues.quantity;

            

            cartItem.dataValues.price = tempPrice.toLocaleString(); // Format price with commas
            await cartItem.save();
        
        } else{

            let tempcartPrice = parseFloat(cakePrice.replace(/,/g, ''))

            let cartPrice = tempcartPrice.toLocaleString(); // Format price with commas

            cartItem = await Cart.create({
                cartID,
                userID: userId,
                cakeID: cakeId,
                size: size,
                quantity: cakeQuantity,
                price: cartPrice,
            });

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
        const { cartID} = req.body

        if(!userID){
            res.status(401).json({error: "unauthorized. please log in"}).redirect("/login")
            throw Error(`User not logged in`)
        }
        const cakeID = req.params.id
        const quantity = req.body.quantity
        const size = req.body.size

        const specificCake = await Cakes.findByPk(cakeID)

        if (!specificCake) {
            return res.status(404).send("Cake not found");
          }

        let cakePrice = specificCake?.dataValues.price

        const cartItem = await addToCart(cartID, userID, cakeID, quantity, size, cakePrice)

        res.status(200).send(`Cake Added to Cart`)
    } catch(error){
        res.status(500).send(`Cake not added to Cart`)
    }
}

const getUserCart = async(req: AuthRequest, res:Response)=>{
    try {
        const userID = req.user?.userID;

        const userInfo = await req.cookies.user

        res.locals.userDetails = userInfo ? JSON.parse(userInfo) : null;

    if(!userID){
        res.status(401).redirect("/cakemania.ng/users/login")
        throw Error(`User not logged in`)
    }
    else{
        const userCart = await Cart.findOne({where:{userID: userID}})

        res.render('cart', { userCart , currentPage: 'cart'})

    }
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