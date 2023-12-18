import {Sequelize, Model, DataTypes} from "sequelize" //I did not install any package
import sequelize from "../database.config" //could change the path to the config file
import Cakes from "./cakemodel";
import { v4 as uuidv4 } from 'uuid';

interface userAtrributes{
    firstName: string;
    lastName: string;
    userID: string | null;
    email: string;
    password: string;
    // passwordConfirm: string;
    phoneNo: string;
    // userAddress: string;
    // userState: string;
    // userLga: string;
    isAdmin: boolean;
}

export class Users extends Model <userAtrributes> {}


Users.init({
    firstName: {
        type: DataTypes.STRING,
        allowNull: false

    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false

    },
    userID : {
        type: DataTypes.TEXT,
        defaultValue: () => uuidv4(),
        primaryKey: true,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
        
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
        
    },
    // passwordConfirm: {
    //     type: DataTypes.STRING,
    //     allowNull: false
        
    // },
    phoneNo: {
        type: DataTypes.STRING,
        allowNull: false,
        
    },
    
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
}, {
    sequelize,
    modelName: "Users"
})


Users.hasMany(Cakes, { foreignKey: 'userID' });

// Users.hasMany(Orders, {as: "orders", foreignKey: "userId"})
//I think we shoud consider putting all the association in one document

// Users === sequelize.models.Users 

export default Users


// userAddress: {
    //     type: DataTypes.STRING,
    //     allowNull: false
    // },
    // userState :{
    //     type: DataTypes.STRING,
    //     allowNull: false
    // },
    // userLga: {
    //     type: DataTypes.STRING,
    //     allowNull: false
    // },