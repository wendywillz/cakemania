"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserCart = void 0;
const sequelize_1 = require("sequelize"); //I did not install any package
const database_config_1 = __importDefault(require("../database.config"));
const usermodel_1 = __importDefault(require("./usermodel"));
const cartmodel_1 = __importDefault(require("./cartmodel"));
class UserCart extends sequelize_1.Model {
}
exports.UserCart = UserCart;
//Ive included the LGA and State. But I need to ask: if we're already asking for the address, doesn't that make requesting those, redundant?
UserCart.init({
    userID: {
        type: sequelize_1.DataTypes.STRING,
        references: {
            model: usermodel_1.default,
            key: 'userID'
        },
    },
    cartID: {
        type: sequelize_1.DataTypes.STRING,
        references: {
            model: cartmodel_1.default,
            key: 'cartID'
        },
    },
}, {
    sequelize: database_config_1.default,
    modelName: "UserCart"
});
// UserCart === sequelize.models.UserCart
exports.default = UserCart;
