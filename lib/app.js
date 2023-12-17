"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_errors_1 = __importDefault(require("http-errors"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = require("dotenv");
const database_config_1 = __importDefault(require("./database.config"));
const categorymodel_1 = __importDefault(require("./models/categorymodel"));
const cakemodel_1 = __importDefault(require("./models/cakemodel"));
const itemModel_1 = __importDefault(require("./models/itemModel"));
const ordermodel_1 = __importDefault(require("./models/ordermodel"));
const usermodel_1 = __importDefault(require("./models/usermodel"));
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const api = process.env.API_URL;
const index_1 = __importDefault(require("./routes/index"));
const users_1 = __importDefault(require("./routes/users"));
//middleawares
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use((0, morgan_1.default)('dev'));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.static(path_1.default.join(__dirname, '../', 'public')));
//database connection
const models = [categorymodel_1.default, cakemodel_1.default, itemModel_1.default, ordermodel_1.default, usermodel_1.default];
// Synchronize the models with the database
function syncDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield database_config_1.default.authenticate();
            console.log('Connection to the database has been established successfully.');
            // Sync all models
            yield database_config_1.default.sync(); // Set force: true cautiously for development
            console.log('Database synchronized successfully.');
        }
        catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    });
}
// Call the syncDatabase function
syncDatabase();
// sequelize.sync()
// .then( () => {
//     console.log('DATABASE CONNECTED')
// })
// .catch((error) => {
//     console.log('ERROR ERROR IN CONNECTING DATABASE', error)
// })
// view engine setup
app.set('views', path_1.default.join(__dirname, '../', 'views'));
app.set('view engine', 'ejs');
//routes
app.use(`${api}`, index_1.default);
app.use(`${api}/users`, users_1.default);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next((0, http_errors_1.default)(404));
});
// error handler
// app.use(function(err:any, req:Request, res:Response, next:NextFunction) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });
module.exports = app;
// var createError = require('http-errors');
// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');
