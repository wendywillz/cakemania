// import {Sequelize, Model, DataTypes} from "sequelize" //I did not install any package
// import sequelize from "../database.config"
// import Users from "./usermodel";
// import Cart from "./cartmodel";
// // import Orders from "./ordermodel";
// import { v4 as uuidv4 } from 'uuid';

// //could change the path to the config file
// // import Items from "./itemModel"
// // import Users  from "./usermodel"
// // import  Cakes  from "./cakemodel"

// interface UserOrderAtrributes{
//     userOrderID:string,
//     orderID: string,
//     userID: string,
// }

// export class UserOrder extends Model <UserOrderAtrributes> {}

// UserOrder.init({
//     userOrderID :{
//         type: DataTypes.TEXT,
//         defaultValue: ()=>uuidv4(),
//         primaryKey: true,
//         allowNull:false,
//         autoIncrement: false
//     },
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

// }, {
//     sequelize,
//     modelName: "UserOrder"
// })

// // UserOrder === sequelize.models.UserOrder

//  export default UserOrder
