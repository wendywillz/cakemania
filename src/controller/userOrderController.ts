// import { Request, Response,} from "express";
// import UserOrder from "../models/userOrderModel";
// import Orders from "../models/ordermodel";
// import { v4 as uuidv4 } from 'uuid';
// interface AuthRequest extends Request {
//     user?: { userID: string, isAdmin: boolean };
//   }


// const createUserOrder = async (newOrderId:string)=>{
   
//     const specificOrder = await Orders.findByPk(newOrderId)
//     if(!specificOrder){
//      throw new Error(`Order does not exist`)
//     }
//     const specificUserId = specificOrder.dataValues.userID
     
//     const userOrderID = uuidv4()
//     const newUserOrder = await UserOrder.create({
//         userOrderID: userOrderID,
//         orderID: newOrderId,
//         userID: specificUserId,
//     })
//     return newUserOrder
     
//  }


//  ////////////////////////////////////////////////////////////////////////////////////////////////////
// //DELETE USER ORDERS
//  const deleteUserOrder = async (req:AuthRequest, res:Response)=>{
//     const specificUserID = req.user?.userID;
    
//     const existingUserOrder = await UserOrder.findOne({where:{userID:specificUserID}})
   
//     if (!existingUserOrder){
//         res.status(404).send(`<h1>USER ORDER NOT FOUND</h1>`)
//         throw new Error (`User order not found`)
//     }
//     await existingUserOrder.destroy()
// }







// export {createUserOrder, deleteUserOrder}
