// import {Sequelize, Model, DataTypes} from "sequelize" //I did not install any package
// import sequelize from "../database.config" 
// import Users from "./usermodel";
// import Cart from "./cartmodel";
// import Orders from "./ordermodel";
// import { v4 as uuidv4 } from 'uuid';

// //could change the path to the config file
// // import Items from "./itemModel"
// // import Users  from "./usermodel"
// // import  Cakes  from "./cakemodel"

// interface UserCartAtrributes{
//     orderID: string,
//     userID: string,
//     cartID: string,
// }

// export class UserCart extends Model <UserCartAtrributes> {}


// //Ive included the LGA and State. But I need to ask: if we're already asking for the address, doesn't that make requesting those, redundant?

// UserCart.init({
//     orderID:{
//         type: DataTypes.STRING,
//         references: {
//             model: Orders,
//             key: 'orderID'
//         },
//     },
//     userID: {
//         type: DataTypes.STRING,
//         references: {
//             model: Users,
//             key: 'userID'
//         },
//     },
//     cartID :{
//         type: DataTypes.STRING,
//         references: {
//             model: Cart,
//             key: 'cartID'
//         },
//     },

// }, {
//     sequelize,
//     modelName: "UserCart"
// })



// // UserCart === sequelize.models.UserCart

//  export default UserCart
