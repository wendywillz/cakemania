import { Request, Response,} from "express";
import Cart from "../models/cartmodel"
import Cakes from "../models/cakemodel";
import Orders from '../models/ordermodel';
import  UserCart  from "../models/userCartModel";
import Users from "../models/usermodel";

import { where } from "sequelize";

interface AuthRequest extends Request {
    user?: { userID: string, isAdmin: boolean };
  }

  interface CartWithCake extends Cart {
    Cake: Cakes;
}



// const orderDetails = async(req: AuthRequest, res:Response)=>{

//     const specificUserID = req.user?.userID;

//     if(!specificUserID){
//         res.status(404).send(`User not found`)
//         throw new Error(`User not fund`)
//     }
//     const order = await Orders.findOne({
//         include:{
//             model:Cart,
//             required:true,
//         }, 
//         where:{userID:specificUserID}})

//     if(!order){
//         res.status(404).send(`Order not found`)
//         throw new Error(`Order not found`)
//     }    
//     order.dataValues.total = await getTotalOrder(specificUserID)
//     }



const getCartItems =  async(req: AuthRequest, res:Response)=>{

    const specificUserID = req.user?.userID;

    

    const allCartItems = await Cart.findAll(
      {where:{userID:specificUserID},
      include: [Cakes] as any, 
    
    })


    res.render('orders', {  allCartItems, currentPage: 'index'} )
}

////////////////////////////////////////////////////////////////////////////////////////////////////


const getOrderTotal = async(req: AuthRequest, res:Response)=>{



    const userInfo =  await req.cookies.user
  
    res.locals.userDetails = userInfo ? JSON.parse(userInfo) : null;
    

    const specificUserID = req.user?.userID;

    const user = await Users.findByPk(specificUserID)

    const allCartItems = await Cart.findAll(
      {
        where:{userID:specificUserID}, 
        include: [Cakes] as any, // Cast include to any to prevent TypeScript error
            }) as CartWithCake[];
      
      

    let tempOrderTotal:number = 0
    if(allCartItems.length>0){
        for(let cart of allCartItems){
            tempOrderTotal += parseInt(cart.dataValues.price.replace(/,/g, ''))
        }
    }
    let orderTotal = tempOrderTotal.toLocaleString()
  

    res. render('orders', { user, allCartItems, orderTotal, currentPage: 'index'})
}


async function getTotalOrder(userid: string){
    const allCartItems = await Cart.findAll({where:{userID:userid}})
    let tempOrderTotal:number = 0
    if(allCartItems.length>0){
        for(let cart of allCartItems){
            tempOrderTotal += parseInt(cart.dataValues.price.replace(/,/g, ''))
        }
    }
    let orderTotal = tempOrderTotal.toLocaleString()
    return orderTotal
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//CREATE ORDER
const createOrder = async(req:AuthRequest, res:Response)=>{

    const specificUserID = req.user?.userID;
    if(!specificUserID){
        res.status(404).send(`User not found`)
        throw new Error(`User not fund`)
    }
const { orderID} = req.body

const deliveryPhoneNo = req.body.deliveryPhoneNo
const deliveryAddress = req.body.deliveryAddress
const deliveryState = req.body.deliveryState
const deliveryLga = req.body.deliveryLga
const additionalInfo = req.body.additionalInfo

const cart = await Cart.findAll({where:{userID:specificUserID}})
const totalOrder = await getTotalOrder(specificUserID)


const existingOrder = await Orders.findOne({where:{userID: specificUserID}})
if(existingOrder){
    res.status(400).send(`Order already exists`)
    throw new Error(`Order already exists`)
} 
    const newOrder = await Orders.create({
        orderID: orderID,
        cartItem: specificUserID,
        userID: specificUserID,
        total: totalOrder,
        status,
        deliveryPhoneNo: deliveryPhoneNo,
        deliveryAddress: deliveryAddress,
        deliveryState: deliveryState,
        deliveryLga: deliveryLga,
        additionalInfo: additionalInfo
    })
console.log(newOrder);

// const orderItems = await UserCart.findAll({where:{userID: newOrder.dataValues.userCart}})


return newOrder
// return orderItems

}
/////////////////////////////////////////////////////////////////////////////////////////////////////
//Getting an order

const getOrder = async(req:AuthRequest, res:Response) =>{
    const specificUserID = req.user?.userID;
    if(!specificUserID){
        res.status(404).send(`User not found`)
        throw new Error(`User not found`)
    }
    const specificOrder = await Orders.findOne({where:{userID:specificUserID}})


    /*
    const specificOrder = await Orders.findOne({where:{userID:specificUserID}, 
        include:{model: UserCart, 
            where:{userID:specificUserID}}})
    
    */
    if(!specificOrder){
        res.status(404).send(`Order not found`)
        throw new Error(`Order not found`)
    }
  
    return specificOrder
}


const getAllOrderItems = async(req:AuthRequest, res:Response) =>{
    const specificUserID = req.user?.userID;
    if(!specificUserID){
        res.status(404).send(`User not found`)
        throw new Error(`User not found`)
    }
    const specificOrder = await Orders.findOne({where:{userID:specificUserID}})


    /*
    const specificOrder = await Orders.findOne({where:{userID:specificUserID}, 
        include:{model: UserCart, 
            where:{userID:specificUserID}}})
    */
   
    if(!specificOrder){
        res.status(404).send(`Order not found`)
        throw new Error(`Order not found`)
    }
    const allOrderItems = await UserCart.findAll({where:{userID:specificOrder.dataValues.userID}})
    return allOrderItems
}



////////////////////////////////////////////////////////////////////////////////////////////////////
//DELETING ORDERS
const deleteOrder = async(req:Request, res:Response)=>{
    
    const specificOrderId = req.params.id
    const existingOrder = await Orders.findOne({where:{orderID: specificOrderId}})
    if(!existingOrder){
        res.status(404).send(`Order not found`)
        throw new Error(`Order does not exist`)
    }
    await existingOrder.destroy()
}





export {getOrderTotal, getCartItems, deleteOrder, createOrder, getAllOrderItems, getOrder}
/**

////////////////////////////////////////////////////////////////////////////////////////////////////

const randomFunction = async(req: AuthRequest, res:Response)=>{
    const specificUserID = req.user?.userID;
    if(!specificUserID){
        res.status(404).send(`User not found`)
        throw new Error(`User not fund`)
    }
    const allCartItems = await Cart.findAll({where:{userID:specificUserID}})

    let tempOrderTotal:number = 0
    if(allCartItems.length>0){
        for(let cart of allCartItems){
            tempOrderTotal += parseInt(cart.dataValues.price.replace(/,/g, ''))
        }
    }
    let orderTotal = tempOrderTotal.toLocaleString()

    for(let cart of allCartItems){
        await UserCart.create({
            cartID:cart.dataValues.cartID,
            userID: specificUserID,
        })
    }
    }


 */