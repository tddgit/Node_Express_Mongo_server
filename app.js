// const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

//1. MIDDLEWARE.
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());

app.use(express.static(`${__dirname}/public`));

// app.use((req, res, next) => {
//   // console.log('Hello from the middleware');
//   // console.clear()
//   // console.log('++++++++++++++++++++++++++++++=+++++++++++++++')
//   // console.dir(req.body)
//   next();
// });

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log('HEADERS:', req.headers);
  next();
});

//2. ROUTES

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  // const err = new Error(`Cannot find ${req.originalUrl} on this server`);
  // err.status = 'fail';
  // err.statusCode = 404;
  next(new AppError(`Cannot find ${req.originalUrl} on this server!`));
  // res.status(404).json({
  //   status: 'fail',
  //   message: 'Not Found',
  // });
});

app.use(globalErrorHandler);

//3. START SERVER

module.exports = app;

// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// app.get('/', (req, res) => {
//     res
//         .status(200)
//         .json({message: 'Hello from serverside', app: 'Express'});
//
//
// });
//
// app.post('/', (req, res) => {
//     res.send('You can post to this endpoint...')

// })
