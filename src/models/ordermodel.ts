import {Sequelize, Model, DataTypes, DATE} from "sequelize" //I did not install any package
import sequelize from "../database.config" 
import Users from "./usermodel";
import Cart from "./cartmodel";
import { v4 as uuidv4 } from 'uuid';


interface orderAtrributes{
    orderID: string | null;
    userID: string
    orderItems: {};
    total: string;
    deliveryStatus: string;
    deliveryPhoneNo: string;
    deliveryAddress: string;
    deliveryState: string;
    lga: string;
    additionalInfo: string| null;
    orderTime: number
}

export class Orders extends Model <orderAtrributes> {}


Orders.init({
    orderID: {
        type: DataTypes.TEXT,
        defaultValue: () => uuidv4(),
        primaryKey: true,
        allowNull: false,
    },
    userID: {
        type: DataTypes.STRING,
        references: {
            model: Users,
            key: 'userID'
        },
    },
    orderItems :{
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
    },
    total: {
        type: DataTypes.STRING,
        allowNull: false
    },
    deliveryStatus: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "pending"
    },
    deliveryPhoneNo:{
        type: DataTypes.STRING,
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
    lga: {
        type: DataTypes.STRING,
        allowNull: false
    },
    additionalInfo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    orderTime: {
        type: DataTypes.DATE,
  defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },

}, {
    sequelize,
    modelName: "Orders"
})

Orders.hasMany(Cart, {foreignKey: "cartID", as: 'cartItems'})

Users.hasMany(Cart, {foreignKey: "userID"})



export default Orders