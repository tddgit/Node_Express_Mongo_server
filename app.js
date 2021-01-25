const fs = require('fs');
const express = require('express');
const morgan= require('morgan')
const app = express();

const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')

//1. MIDDLEWARE.
app.use(morgan('dev'));

app.use(express.json());

app.use(express.static(`${__dirname}/public`))


app.use((req, res, next) => {
    console.log('Hello from the middleware');
    // console.clear()
    // console.log('++++++++++++++++++++++++++++++=+++++++++++++++')
    // console.dir(req.body)
    next();
});

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})

//2. ROUTES

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//3. START SERVER

module.exports = app


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