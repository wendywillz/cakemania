"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cakes = void 0;
const sequelize_1 = require("sequelize");
const uuid_1 = require("uuid");
const database_config_1 = __importDefault(require("../database.config"));
const usermodel_1 = __importDefault(require("./usermodel"));
const categoryModel_1 = __importDefault(require("./categoryModel"));
class Cakes extends sequelize_1.Model {
}
exports.Cakes = Cakes;
Cakes.init({
    cakeName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    cakeID: {
        type: sequelize_1.DataTypes.TEXT,
        defaultValue: () => (0, uuid_1.v4)(),
        primaryKey: true,
        allowNull: false,
    },
    category: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: categoryModel_1.default,
            key: 'categoryID'
        }
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
        type: sequelize_1.DataTypes.STRING,
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
    },
    userID: {
        type: sequelize_1.DataTypes.TEXT,
        // allowNull: false,
        references: {
            model: usermodel_1.default,
            key: 'userID'
        }
    }
}, {
    sequelize: database_config_1.default,
    modelName: "Cakes"
});
console.log(Cakes === database_config_1.default.models.Cakes);
// Cakes.hasMany(Cart, { foreignKey: 'cakeID' });
// Cakes.belongsTo(Users, { foreignKey: 'userID' });
exports.default = Cakes;
