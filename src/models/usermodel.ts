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
    phoneNo: string;
    address: string | null;
    state: string | null;
    lga: string | null;
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
    phoneNo: {
        type: DataTypes.STRING,
        allowNull: false,
        
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    state :{
        type: DataTypes.STRING,
        allowNull: true
    },
    lga: {
        type: DataTypes.STRING,
        allowNull: true
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


export default Users

