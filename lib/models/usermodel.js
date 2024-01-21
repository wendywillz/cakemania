"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
const sequelize_1 = require("sequelize"); //I did not install any package
const database_config_1 = __importDefault(require("../database.config")); //could change the path to the config file
const cakemodel_1 = __importDefault(require("./cakemodel"));
const uuid_1 = require("uuid");
class Users extends sequelize_1.Model {
}
exports.Users = Users;
Users.init({
    firstName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    userID: {
        type: sequelize_1.DataTypes.TEXT,
        defaultValue: () => (0, uuid_1.v4)(),
        primaryKey: true,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    phoneNo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    state: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    lga: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    isAdmin: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
}, {
    sequelize: database_config_1.default,
    modelName: "Users"
});
Users.hasMany(cakemodel_1.default, { foreignKey: 'userID' });
exports.default = Users;
