import {Sequelize, Model, DataTypes} from "sequelize" 
import { v4 as uuidv4 } from 'uuid';
import sequelize from "../database.config";
import Users from "./usermodel";
import Categories from "./categoryModel";
import Cart from "./cartmodel";



// import { Orders } from "./ordermodel";
// import { Users} from "./usermodel";


interface cakeAtrributes{
    cakeName: string;
    cakeID: string|null
    category: number;
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
        type: DataTypes.INTEGER,
        references: {
            model: Categories,
            key: 'categoryID'
        }
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
        type: DataTypes.STRING,
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

// Cakes.hasMany(Cart, { foreignKey: 'cakeID' });
// Cakes.belongsTo(Users, { foreignKey: 'userID' });


export default Cakes