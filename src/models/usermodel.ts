import {Sequelize, Model, DataTypes} from "sequelize" //I did not install any package
import sequelize from "../database.config" //could change the path to the config file
import {Orders} from "./ordermodel"

interface userAtrributes{
    firstName: string;
    lastName: string;
    userId: string;
    email: string;
    password: string;
    passwordConfirm: string;
    phoneNo: number;
    userAddress: string;
    userState: string;
    userLga: string;
    isAdmin: boolean;
}

export class Users extends Model <userAtrributes> {}

//Ive included the LGA and State. But I need to ask: if we're already asking for the address, doesn't that make requesting those, redundant?

Users.init({
    firstName: {
        type: DataTypes.STRING,
        allowNull: false

    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false

    },
    userId : {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        autoIncrement: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
        
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
        
    },
    passwordConfirm: {
        type: DataTypes.STRING,
        allowNull: false
        
    },
    phoneNo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        
    },
    userAddress: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userState :{
        type: DataTypes.STRING,
        allowNull: false
    },
    userLga: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
}, {
    sequelize,
    modelName: "Users"
})

Users.hasMany(Orders, {as: "orders", foreignKey: "userId"})
//I think we shoud consider putting all the association in one document

// Users === sequelize.models.Users 

export default Users