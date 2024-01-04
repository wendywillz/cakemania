//CARTMODEL - REDONE

import {Sequelize, Model, DataTypes} from "sequelize" //I did not install any package
import sequelize from "../database.config" 
import Cakes from "./cakemodel";
import Users from "./usermodel";
import { v4 as uuidv4 } from 'uuid';
interface cartAtrributes{
    cartID: string
    userID: string,
    cakeID: string|null;
    size: string;
    quantity: number;
    price: string;
    
}
export class Cart extends Model <cartAtrributes> {}


Cart.init({
    cartID :{
        type: DataTypes.TEXT,
        defaultValue: ()=>uuidv4(),
        primaryKey: true,
        allowNull:false,
        autoIncrement: false
    },
    userID: {
        type: DataTypes.STRING,
        references: {
            model: Users,
            key: 'userID'
        },
    },
    cakeID: {
        type: DataTypes.STRING,
        references: {
            model: Cakes,
            key: 'cakeID'
        }
    },
    size: {
        type: DataTypes.STRING,
        allowNull: true
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    price: {
        type: DataTypes.STRING,
        allowNull: false
    },
    
    
}, 
{
    sequelize,
    modelName: "Cart"
})

Cart.belongsTo(Cakes, {foreignKey: 'cakeID'})
Cart.belongsTo(Users, {foreignKey: 'userID'})

 export default Cart