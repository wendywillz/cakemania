"use strict";
//CARTMODEL - REDONE
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cart = void 0;
const sequelize_1 = require("sequelize"); //I did not install any package
const database_config_1 = __importDefault(require("../database.config"));
const cakemodel_1 = __importDefault(require("./cakemodel"));
const usermodel_1 = __importDefault(require("./usermodel"));
const uuid_1 = require("uuid");
class Cart extends sequelize_1.Model {
}
exports.Cart = Cart;
Cart.init({
    cartID: {
        type: sequelize_1.DataTypes.TEXT,
        defaultValue: () => (0, uuid_1.v4)(),
        primaryKey: true,
        allowNull: false,
        autoIncrement: false
    },
    userID: {
        type: sequelize_1.DataTypes.STRING,
        references: {
            model: usermodel_1.default,
            key: 'userID'
        },
    },
    cakeID: {
        type: sequelize_1.DataTypes.STRING,
        references: {
            model: cakemodel_1.default,
            key: 'cakeID'
        }
    },
    size: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    quantity: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    price: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
}, {
    sequelize: database_config_1.default,
    modelName: "Cart"
});
Cart.belongsTo(cakemodel_1.default, { foreignKey: 'cakeID' });
Cart.belongsTo(usermodel_1.default, { foreignKey: 'userID' });
exports.default = Cart;
