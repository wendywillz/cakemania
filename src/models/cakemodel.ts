import {Sequelize, Model, DataTypes} from "sequelize" //I did not install any package
import sequelize from "../config/database.config" //could change the path to the config file
import { Orders } from "./ordermodel";
import { Users} from "./usermodel";




interface cakeAtrributes{
    cakeName: string;
    cakeID: string;
    category: string;
    description: string;
    image: string;
    flavour: string;
    price: number;
    rating: number;
    commments: string;
    numReviews: number;
}

export class Cakes extends Model <cakeAtrributes> {}

Cakes.init({
    cakeName: {
        type: DataTypes.STRING,
        allowNull: false

    },
    cakeID: {
        type: DataTypes.UUID,
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
    commments: {
        type: DataTypes.STRING,
        allowNull: true

    },
    numReviews: {
        type: DataTypes.INTEGER,
        allowNull: true

    },
}, {
    sequelize,
    modelName: "Cakes"
})

Cakes === sequelize.models.Cakes 