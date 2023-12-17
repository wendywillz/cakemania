import {Sequelize, Model, DataTypes} from "sequelize" 

import sequelize from "../database.config";


// import { Orders } from "./ordermodel";
// import { Users} from "./usermodel";


interface cakeAtrributes{
    cakeName: string;
    cakeID: number | null;
    category: string;
    description: string | null;
    image: string;
    flavour: string;
    price: string;
    rating: number | null;
    comments: string | null;
    numReviews: number |null;
}

export class Cakes extends Model<cakeAtrributes> {}

Cakes.init({
    cakeName: {
        type: DataTypes.STRING,
        allowNull: false

    },
    cakeID: {
        type: DataTypes.NUMBER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: false,

    },
    category : {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
        
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
        
    },
    flavour: {
        type: DataTypes.STRING,
        allowNull: false,
        
    },
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: true

    },
    comments: {
        type: DataTypes.STRING,
        allowNull: true

    },
    numReviews: {
        type: DataTypes.INTEGER,
        allowNull: true

    }
}, {
    sequelize,
    modelName: "Cakes"
})

console.log(Cakes === sequelize.models.Cakes)

export default Cakes