import {Sequelize, Model, DataTypes} from "sequelize" //I did not install any package
import sequelize from "../database.config" 
import Users from "./usermodel";
import Cart from "./cartmodel";
import { v4 as uuidv4 } from 'uuid';

//could change the path to the config file
// import Items from "./itemModel"
// import Users  from "./usermodel"
// import  Cakes  from "./cakemodel"

interface orderAtrributes{
    orderID: string;
    // carts: Cart[],
    userID: string
    total: string;
    status: string;
    deliveryPhoneNo: string;
    deliveryAddress: string;
    deliveryState: string;
    deliveryLga: string;
    additionalInfo: string| null;
}

export class Orders extends Model <orderAtrributes> {}


//Ive included the LGA and State. But I need to ask: if we're already asking for the address, doesn't that make requesting those, redundant?

Orders.init({
    orderID: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue:()=>uuidv4(),
        primaryKey: true,
        autoIncrement: false
    },
    // carts :{
    //     type: DataTypes.ARRAY(DataTypes.UUID),
    //     references: {
    //         model: Cart,
    //         key: 'cartID'
    //     },
    //     defaultValue: []
    // },
    userID: {
        type: DataTypes.STRING,
        references: {
            model: Users,
            key: 'userID'
        },
    },
    total: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    deliveryPhoneNo:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    deliveryAddress: {
        type: DataTypes.STRING,
        allowNull: false
    },
    deliveryState :{
        type: DataTypes.STRING,
        allowNull: false
    },
    deliveryLga: {
        type: DataTypes.STRING,
        allowNull: false
    },
    additionalInfo: {
        type: DataTypes.STRING,
        allowNull: true
    },

}, {
    sequelize,
    modelName: "Orders"
})



// Orders === sequelize.models.Orders

export default Orders