import {Sequelize, Model, DataTypes} from "sequelize" 
import { v4 as uuidv4 } from 'uuid';
import sequelize from "../database.config";
import Users from "./usermodel";





// import { Orders } from "./ordermodel";
// import { Users} from "./usermodel";


interface cakeAtrributes{
    cakeName: string;
    cakeID: number,
    category: string;
    description: string | null;
    image: string;
    flavour: string;
    price: string;
    rating: number | null;
    comments: string | null;
    numReviews: number |null;
    userID: string | null
}

export class Cakes extends Model<cakeAtrributes> {}

Cakes.init({
    cakeName: {
        type: DataTypes.STRING,
        allowNull: false

    },
    cakeID: {
        type: DataTypes.TEXT,
        defaultValue: () => uuidv4(),
        primaryKey: true,
        allowNull: false,
    },
    category : {
        type: DataTypes.STRING,
        allowNull: false,
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

    },

    userID: {
        type: DataTypes.TEXT,
        // allowNull: false,
        references: {
            model: Users,
            key: 'userID'
        }
        
      }
}, {
    sequelize,
    modelName: "Cakes"
})

console.log(Cakes === sequelize.models.Cakes)


export default Cakes