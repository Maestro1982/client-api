require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const port = process.env.PORT || 3001;

// API Security
app.use(helmet());

// Handle Cors Errors
app.use(cors());

// MongoDB Connection Setup
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_DB_URL);

if (process.env.NODE_ENV !== 'production') {
  const mongoDB = mongoose.connection;
  mongoDB.on('open', () => {
    console.log('MongoDB is connected');
  });

  mongoDB.on('error', (error) => {
    console.log(error);
  });

  // Logger
  app.use(morgan('tiny'));
}

// Set Bodyparser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Load Routers
const userRouter = require('./src/routers/userRouter');
const ticketRouter = require('./src/routers/ticketRouter');

// Use Routers
app.use('/v1/user', userRouter);
app.use('/v1/ticket', ticketRouter);

// Error Handler
const handleError = require('./src/utils/errorHandler');

app.use((req, res, next) => {
  const error = new Error('Data Not Found!');
  error.status = 404;

  next(error);
});

app.use((error, req, res, next) => {
  handleError(error, res);
});

app.listen(port, () => {
  console.log(`API is ready on http://localhost:${port}`);
});
