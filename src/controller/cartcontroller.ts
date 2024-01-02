//CART CONTROLLER - REDONE

import { Request, Response,} from "express";
import Cart from "../models/cartmodel"
import Cakes from "../models/cakemodel";


async function addToCart(cakeId : string, cakeQuantity: number, size: string ){
    try {
        let specifiedCake = await Cakes.findByPk(cakeId)
        if(!specifiedCake){
            throw new Error(`Cake not found`)
        }
        let cakePrice = specifiedCake.dataValues.price
        
        let cartItem = await Cart.findOne({where: {cakeID: cakeId}})
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
                cakeID: cakeId,
                size: size,
                quantity : cakeQuantity,
                price: cartPrice

            })
        }
        return cartItem
    } catch (error) {
        throw new Error(`Error adding to cart`)
    }
}


const addCakeToCart =  async(req: Request, res:Response)=>{
    try{
        const {cakeID, quantity, size} = req.body
        const specificCake = Cakes.findByPk(cakeID)
        //const cakeID = specificCake.cakeID
        const cartItem = await addToCart(cakeID, quantity, size)

        res.status(200).send(`Cake Added to Cart`)
    } catch(error){
        res.status(500).send(`Cake not added to Cart`)
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


export {addToCart, addCakeToCart,removeCakeFromCart}