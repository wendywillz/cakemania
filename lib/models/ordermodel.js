"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Orders = void 0;
const sequelize_1 = require("sequelize"); //I did not install any package
const database_config_1 = __importDefault(require("../database.config"));
const usermodel_1 = __importDefault(require("./usermodel"));
const cartmodel_1 = __importDefault(require("./cartmodel"));
const uuid_1 = require("uuid");
class Orders extends sequelize_1.Model {
}
exports.Orders = Orders;
Orders.init({
    orderID: {
        type: sequelize_1.DataTypes.TEXT,
        defaultValue: () => (0, uuid_1.v4)(),
        primaryKey: true,
        allowNull: false,
    },
    userID: {
        type: sequelize_1.DataTypes.STRING,
        references: {
            model: usermodel_1.default,
            key: 'userID'
        },
    },
    orderItems: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
    },
    total: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    deliveryStatus: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: "pending"
    },
    deliveryPhoneNo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    deliveryAddress: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    deliveryState: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    lga: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    additionalInfo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    orderTime: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.Sequelize.literal('CURRENT_TIMESTAMP'),
    },
}, {
    sequelize: database_config_1.default,
    modelName: "Orders"
});
Orders.hasMany(cartmodel_1.default, { foreignKey: "cartID", as: 'cartItems' });
usermodel_1.default.hasMany(cartmodel_1.default, { foreignKey: "userID" });
exports.default = Orders;
