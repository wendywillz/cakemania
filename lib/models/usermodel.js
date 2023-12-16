"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
const sequelize_1 = require("sequelize"); //I did not install any package
const database_config_1 = __importDefault(require("../database.config")); //could change the path to the config file
const ordermodel_1 = require("./ordermodel");
class Users extends sequelize_1.Model {
}
exports.Users = Users;
//Ive included the LGA and State. But I need to ask: if we're already asking for the address, doesn't that make requesting those, redundant?
Users.init({
    firstName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        autoIncrement: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    passwordConfirm: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    phoneNo: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    userAddress: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    userState: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    userLga: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    isAdmin: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false
    },
}, {
    sequelize: database_config_1.default,
    modelName: "Users"
});
Users.hasMany(ordermodel_1.Orders, { as: "orders", foreignKey: "userId" });
//I think we shoud consider putting all the association in one document
// Users === sequelize.models.Users 
exports.default = Users;
