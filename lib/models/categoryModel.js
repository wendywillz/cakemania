"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Categories = void 0;
const sequelize_1 = require("sequelize"); //I did not install any package
const database_config_1 = __importDefault(require("../database.config")); //could change the path to the config file
class Categories extends sequelize_1.Model {
}
exports.Categories = Categories;
Categories.init({
    categoryName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    categoryID: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    categoryImage: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize: database_config_1.default,
    modelName: 'Categories'
});
exports.default = Categories;
