"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserOrder = void 0;
const sequelize_1 = require("sequelize"); //I did not install any package
const database_config_1 = __importDefault(require("../database.config"));
const usermodel_1 = __importDefault(require("./usermodel"));
const ordermodel_1 = __importDefault(require("./ordermodel"));
const uuid_1 = require("uuid");
class UserOrder extends sequelize_1.Model {
}
exports.UserOrder = UserOrder;
UserOrder.init({
    userOrderID: {
        type: sequelize_1.DataTypes.TEXT,
        defaultValue: () => (0, uuid_1.v4)(),
        primaryKey: true,
        allowNull: false,
        autoIncrement: false
    },
    orderID: {
        type: sequelize_1.DataTypes.STRING,
        references: {
            model: ordermodel_1.default,
            key: 'orderID'
        },
    },
    userID: {
        type: sequelize_1.DataTypes.STRING,
        references: {
            model: usermodel_1.default,
            key: 'userID'
        },
    },
}, {
    sequelize: database_config_1.default,
    modelName: "UserOrder"
});
// UserOrder === sequelize.models.UserOrder
exports.default = UserOrder;
