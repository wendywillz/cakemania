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
const multer_1 = __importDefault(require("multer"));
const dotenv_1 = require("dotenv");
const database_config_1 = __importDefault(require("./database.config"));
const method_override_1 = __importDefault(require("method-override"));
const usermodel_1 = __importDefault(require("./models/usermodel"));
const categoryModel_1 = __importDefault(require("./models/categoryModel"));
const cakemodel_1 = __importDefault(require("./models/cakemodel"));
const itemModel_1 = __importDefault(require("./models/itemModel"));
// import Orders from './models/ordermodel';
const index_1 = __importDefault(require("./routes/index"));
const users_1 = __importDefault(require("./routes/users"));
const admin_1 = __importDefault(require("./routes/admin"));
const cakes_1 = __importDefault(require("./routes/cakes"));
const cat_1 = __importDefault(require("./routes/cat"));
(0, dotenv_1.config)();
const upload = (0, multer_1.default)({ dest: 'uploads/' });
const app = (0, express_1.default)();
const api = process.env.API_URL;
//middleawares
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, method_override_1.default)('_method'));
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.static(path_1.default.join(__dirname, '../', 'public')));
//routes
app.use(`${api}`, index_1.default);
app.use(`${api}/users`, users_1.default);
app.use(`${api}/admin`, admin_1.default);
app.use(`${api}/cakes`, cakes_1.default);
app.use(`${api}/categories`, cat_1.default);
//database connection
const models = [cakemodel_1.default, categoryModel_1.default, itemModel_1.default, usermodel_1.default];
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
//associations
categoryModel_1.default.hasMany(cakemodel_1.default, { foreignKey: 'categoryName' });
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
