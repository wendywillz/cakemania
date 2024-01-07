"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Orders = void 0;
const sequelize_1 = require("sequelize"); //I did not install any package
const database_config_1 = __importDefault(require("../database.config"));
const usermodel_1 = __importDefault(require("./usermodel"));
const uuid_1 = require("uuid");
class Orders extends sequelize_1.Model {
}
exports.Orders = Orders;
//Ive included the LGA and State. But I need to ask: if we're already asking for the address, doesn't that make requesting those, redundant?
Orders.init({
    orderID: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        defaultValue: () => (0, uuid_1.v4)(),
        primaryKey: true,
        autoIncrement: false
    },
    // carts :{
    //     type: DataTypes.ARRAY(DataTypes.UUID),
    //     references: {
    //         model: Cart,
    //         key: 'cartID'
    //     },
    //     defaultValue: []
    // },
    userID: {
        type: sequelize_1.DataTypes.STRING,
        references: {
            model: usermodel_1.default,
            key: 'userID'
        },
    },
    total: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    deliveryPhoneNo: {
        type: sequelize_1.DataTypes.INTEGER,
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
    deliveryLga: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    additionalInfo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
}, {
    sequelize: database_config_1.default,
    modelName: "Orders"
});
// Orders === sequelize.models.Orders
exports.default = Orders;
