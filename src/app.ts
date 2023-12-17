import express, { Request, Response, NextFunction} from 'express';
import createError from 'http-errors';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan'
import bodyParser from 'body-parser'
import {config} from 'dotenv'
import sequelize from './database.config';
import Categories from './models/categorymodel'
import Cakes from './models/cakemodel';
import Items from './models/itemModel';
import Orders from './models/ordermodel';
import Users from './models/usermodel';

config()
const app = express();
const api = process.env.API_URL

import indexRouter from './routes/index';
import usersRouter from './routes/users';


//middleawares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../', 'public')));

//database connection
const models = [Categories, Cakes, Items, Orders, Users];

// Synchronize the models with the database
async function syncDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');

    // Sync all models
    await sequelize.sync(); // Set force: true cautiously for development

    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
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
app.set('views', path.join(__dirname, '../', 'views'));
app.set('view engine', 'ejs');



app.get("/categories", )

//routes
app.use(`${api}`, indexRouter);
app.use(`${api}/users`, usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
