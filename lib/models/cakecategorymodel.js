"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CakeCategories = void 0;
// cakecategoriesmodel.js
const sequelize_1 = require("sequelize");
const database_config_1 = __importDefault(require("../database.config"));
class CakeCategories extends sequelize_1.Model {
}
exports.CakeCategories = CakeCategories;
CakeCategories.init({
    cakeID: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false,
        primaryKey: true,
    },
    categoryID: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false,
        primaryKey: true,
    },
}, {
    sequelize: database_config_1.default,
    modelName: 'CakeCategories',
    timestamps: false, // Disable timestamps for this model
});
exports.default = CakeCategories;
