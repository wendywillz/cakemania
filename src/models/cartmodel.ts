//CARTMODEL - REDONE

import {Sequelize, Model, DataTypes} from "sequelize" //I did not install any package
import sequelize from "../database.config" 
import Cakes from "./cakemodel";
import Users from "./usermodel";
import { v4 as uuidv4 } from 'uuid';
interface cartAtrributes{
   // userID: string,
    cakeID: string;
    size: string;
    quantity: number;
    price: string;
    
}
export class Cart extends Model <cartAtrributes> {}


Cart.init({
    /*
    userID: {
        type: DataTypes.STRING,
        references: {
            model: Users,
            key: 'userID'
        },
        primaryKey: true
    },
    */
    cakeID: {
        type: DataTypes.STRING,
        references: {
            model: Cakes,
            key: 'cakeID'
        }
    },
    size: {
        type: DataTypes.STRING,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    price: {
        type: DataTypes.STRING,
        allowNull: false
    },
    
    
}, 
{
    sequelize,
    modelName: "cart"
})

Cart.belongsTo(Cakes, {foreignKey: 'cakeID'})
Cart.belongsTo(Users, {foreignKey: 'userID'})

 export default Cart