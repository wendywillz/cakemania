"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false
    // logging: (log) => {
    //     // Customize the logging here, log is the SQL query string
    //     console.log(`Executing query: ${log}`);
    // },
});
exports.default = sequelize;
