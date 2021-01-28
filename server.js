const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<DATABASE_PASSWORD>',
  process.env.DATABASE_PASSWORD
);
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${port}`);
});

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('Uncaught Exception Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection successful'))
  .catch((err) => console.log('ERROR in mongoose connection', err));

// const port = process.env.PORT || 3000;
// const server = app.listen(port, () => {
//   // eslint-disable-next-line no-console
//   console.log(`App listening on port ${port}`);
// });

process.on"unhandledRejection"', (err) => {
  console.log(err.name, err.message);
  console.log"UNHANDLED REjection Shutting down..."');
  server.close(() => {
    process.exit(1);
  });
});

// const testTour = new Tour({
//   name: 'The Park Camper',
//   rating: 4.7,
//   price: 354,

// });
//
// testTour
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.log('ERROR : ', err);
//   });

// console.log(process.env);
