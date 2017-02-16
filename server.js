'use strict';

const express = require('express');
const morgan = require('morgan');

require('dotenv').config();

const {logger} = require('./utilities/logger');
const {sendEmail} = require('./emailer');
const {FooError, BarError, BizzError} = require('./errors');

const app = express();

const russianRoulette = (req, res) => {
  const errors = [FooError, BarError, BizzError];
  throw new errors[
    Math.floor(Math.random() * errors.length)]('It blew up!');
};

app.use(morgan('common', {stream: logger.stream}));
app.get('*', russianRoulette);

app.use((err, req, res, next) => { 
  
  if(err.name === "FooError" || err.name === "BarError"){
    sendEmail({text: `There was a ${err.name}: ${err.message}. Error stack: ${err.stack}`,
               html: `<p>There was a ${err.name}: ${err.message}. Error stack: ${err.stack}</p>`,
               subject: `A ${err.name} was detected!`});
  }
  next();
});

app.use((err, req, res, next) => {
  logger.error(err);
  res.status(500).json({error: 'Something went wrong'}).end();
});

const port = process.env.PORT || 8080;
const listener = app.listen(port, function () {
  logger.info(`Your app is listening on port ${port}`);
});
