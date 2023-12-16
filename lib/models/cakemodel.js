"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cakes = void 0;
const sequelize_1 = require("sequelize");
const database_config_1 = __importDefault(require("../database.config"));
class Cakes extends sequelize_1.Model {
}
exports.Cakes = Cakes;
Cakes.init({
    cakeName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    cakeID: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: false,
    },
    category: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    flavour: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: sequelize_1.DataTypes.DOUBLE,
        allowNull: false,
    },
    rating: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true
    },
    comments: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    numReviews: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true
    }
}, {
    sequelize: database_config_1.default,
    modelName: "Cakes"
});
console.log(Cakes === database_config_1.default.models.Cakes);
exports.default = Cakes;
