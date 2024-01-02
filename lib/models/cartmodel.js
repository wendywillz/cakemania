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
class Cart extends sequelize_1.Model {
}
exports.Cart = Cart;
Cart.init({
    /*
    userID: {
        type: DataTypes.STRING,
        references: {
            model: Users,
            key: 'userID'
        },
        primaryKey: true
    },
    */
    cakeID: {
        type: sequelize_1.DataTypes.STRING,
        references: {
            model: cakemodel_1.default,
            key: 'cakeID'
        }
    },
    size: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    quantity: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    price: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
}, {
    sequelize: database_config_1.default,
    modelName: "cart"
});
Cart.belongsTo(cakemodel_1.default, { foreignKey: 'cakeID' });
Cart.belongsTo(usermodel_1.default, { foreignKey: 'userID' });
exports.default = Cart;