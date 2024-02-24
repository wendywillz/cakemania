import { Request, Response } from "express";
import Cart from "../models/cartmodel";
import Cakes from "../models/cakemodel";
import Orders from "../models/ordermodel";

import Users from "../models/usermodel";

import { where } from "sequelize";

interface AuthRequest extends Request {
  user?: { userID: string; isAdmin: boolean };
}

interface CartWithCake extends Cart {
  Cake: Cakes;
}

// interface cartItems extends Orders {
//     Cake: Cakes;
//   }

async function getTotalOrder(userid: string) {
  const allCartItems = await Cart.findAll({ where: { userID: userid } });
  let tempOrderTotal: number = 0;
  if (allCartItems.length > 0) {
    for (let cart of allCartItems) {
      tempOrderTotal += parseInt(cart.dataValues.price.replace(/,/g, ""));
    }
  }
  let orderTotal = tempOrderTotal.toLocaleString();
  return orderTotal;
}

export async function createOrder(req: AuthRequest, res: Response) {
  try {
    const specificUserID = req.user?.userID;

    const userInfo = await req.cookies.user;

    res.locals.userDetails = userInfo ? JSON.parse(userInfo) : null;

    if (!specificUserID) {
      res.redirect("/cakemania.ng/users/login");
    } else {
      const userCart = JSON.parse(userInfo).userID
        ? await Cart.findAll({
            where: { userID: JSON.parse(userInfo).userID },
          })
        : null;

      res.locals.userCart = userCart;

      const userItems = (await Cart.findAll({
        where: {
          userID: specificUserID,
        },
        include: [Cakes], // Cast include to any to prevent TypeScript error
      })) as CartWithCake[];

      //   const orderItems = {
      //     items: userItems,
      //   };

      const orderItems = userItems.map((item) => ({
        cartID: item.dataValues.cartID,
        cakeID: item.dataValues.cakeID,
        cakeName: item.Cake.dataValues.cakeName,
        cakeImage: item.Cake.dataValues.image,
        quantity: item.dataValues.quantity,
        price: item.dataValues.price,
        size: item.dataValues.quantity,
        userID: item.dataValues.userID,

        // ... other item details you might want to include
      }));

      const orderID = req.body.orderID;
      const totalOrder = await getTotalOrder(specificUserID);
      const deliveryPhoneNo = req.body.deliveryPhoneNo;
      const deliveryAddress = req.body.deliveryAddress;
      const deliveryState = req.body.deliveryState;
      const lga = req.body.lga;
      const additionalInfo = req.body.additionalInfo;
      const orderTime = Date.now();
      const deliveryStatus = req.body.deliveryStatus;

      console.log(orderID);

      const placedOrder = await Orders.create({
        orderID,
        userID: specificUserID,
        orderItems,
        total: totalOrder,
        deliveryStatus,
        deliveryPhoneNo,
        deliveryAddress,
        lga,
        additionalInfo,
        deliveryState,
        orderTime,
      });

      console.log(placedOrder);

      res.redirect("/cakemania.ng/users/order/success");
    }
  } catch (error) {
    console.error(error);
  }
}

export async function getCartItems(req: AuthRequest, res: Response) {
  const specificUserID = req.user?.userID;

  const allCartItems = await Cart.findAll({
    where: { userID: specificUserID },
    include: [Cakes] as any,
  });

  res.render("orders", { allCartItems, currentPage: "index" });
}

export async function getOrderTotal(req: AuthRequest, res: Response) {
  const userInfo = await req.cookies.user;

  res.locals.userDetails = userInfo ? JSON.parse(userInfo) : null;

  const userCart = JSON.parse(userInfo).userID
    ? await Cart.findAll({
        where: { userID: JSON.parse(userInfo).userID },
      })
    : null;

  res.locals.userCart = userCart;

  const specificUserID = req.user?.userID;

  const user = await Users.findByPk(specificUserID);

  const allCartItems = (await Cart.findAll({
    where: { userID: specificUserID },
    include: [Cakes] as any,
  })) as CartWithCake[];

  let tempOrderTotal: number = 0;
  if (allCartItems.length > 0) {
    for (let cart of allCartItems) {
      tempOrderTotal += parseInt(cart.dataValues.price.replace(/,/g, ""));
    }
  }
  let orderTotal = tempOrderTotal.toLocaleString();

  res.render("orders", {
    user,
    allCartItems,
    orderTotal,
    currentPage: "index",
  });
}

export async function getOrderSuccessPage(req: AuthRequest, res: Response) {
  try {
    const userID = req.user?.userID;

    if (!userID) {
      res.render("login", { message: "unauthorized" });
    } else {
      const user = await Users.findByPk(userID);

      res.render("order-success", { currentPage: "index", user });
    }
  } catch (error) {
    console.error(error);
  }
}

export async function getOrdersInProfilePage(req: AuthRequest, res: Response) {
  try {
    const userID = req.user?.userID;

    const usersOrders = await Orders.findAll({
      where: {
        userID: userID,
      },
      include: [
        {
          model: Cart,
          as: "cartItems", // Use the correct alias here
          include: [Cakes],
        },
      ],
    });

    console.log(usersOrders);

    const formattedOrders = usersOrders.map((order) => {
      const orderItemsDetails = Array.isArray(order.dataValues.orderItems)
        ? order.dataValues.orderItems.map((item) => ({
            cartID: item.cartID,
            cakeID: item.cakeID,
            cakeName: item.Cake.cakeName, // Access the cakeName from the associated Cake model
            cakeImage: item.Cake.image, // Access the image from the associated Cake model
            quantity: item.quantity,
            price: item.price,
            size: item.size,
            userID: item.userID,
            // ... other item details you might want to include
          }))
        : [];

      console.log(orderItemsDetails);

      return {
        orderID: order.dataValues.orderID,
        userID: order.dataValues.userID,
        orderItems: orderItemsDetails,
        total: order.dataValues.total,
        deliveryStatus: order.dataValues.deliveryStatus,
        deliveryPhoneNo: order.dataValues.deliveryPhoneNo,
        deliveryAddress: order.dataValues.deliveryAddress,
        lga: order.dataValues.lga,
        additionalInfo: order.dataValues.additionalInfo,
        deliveryState: order.dataValues.deliveryState,
        orderTime: order.dataValues.orderTime,
      };
    });

    console.log(formattedOrders);

    res.render("users/user-orders", {
      currentPage: "user-dashboard",
      formattedOrders,
    });
  } catch (error) {
    console.error(error);
  }
}

// /*
// //finding if the order already exists
// const existingUsercart = await UserOrder.findOne({where:{userID: specificUserID},
// include:{
//     model:Orders,
//     required:true,
//     where:{
//         userID: specificUserID
//     }
// }})

// const existingOrder = await Orders.findOne({where:{userID: specificUserID}}) //find something else to query the Order. if you use the userID, the next time the same user makes an order, it would throw an error because there already exists an order with that userID. maybe use something specific to that order like the sessionID used to make it.
// if(existingOrder){
//     res.status(400).send(`Order already exists`)
//     throw new Error(`Order already exists`)
// }
// */

// const getAllOrderItems = async(req:AuthRequest, res:Response) =>{
//     const specificUserID = req.user?.userID;
//     if(!specificUserID){
//         res.status(404).send(`User not found`)
//         throw new Error(`User not found`)
//     }
//     const specificOrder = await Orders.findOne({where:{userID:specificUserID}})

//     /*
//     const specificOrder = await Orders.findOne({where:{userID:specificUserID},
//         include:{model: UserCart,
//             where:{userID:specificUserID}}})
//     */

//     if(!specificOrder){
//         res.status(404).send(`Order not found`)
//         throw new Error(`Order not found`)
//     }
//     const allOrderItems = await UserCart.findAll({where:{userID:specificOrder.dataValues.userID}})
//     return allOrderItems
// }
