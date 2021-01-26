// eslint-disable-next-line no-undef
// const fs = require('fs');
const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = async (req, res) => {
  // console.log(req.requestTime);
  try {
    // //1A) Filtering
    // const queryObj = { ...req.query };
    // const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // excludedFields.forEach((el) => delete queryObj[el]);
    //
    // // console.log(req.query, queryObj);
    //
    // //1B) Advanced filtering
    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    //
    // // console.log(JSON.parse(queryStr));
    //
    // let query = Tour.find(JSON.parse(queryStr));
    //
    // // const query = Tour.find()
    // //   .where('duration')
    // //   .equals(5)
    // //   .where('difficulty')
    // //   .equals('easy');
    //
    // //2) SORTING
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(',').join(' ');
    //   query = query.sort(sortBy);
    //   //sort('price ratingsAverage')
    // } else {
    //   query = query.sort('-createdAt');
    // }
    //
    // //3) FIELDS LIMITING
    // if (req.query.fields) {
    //   const fields = req.query.fields.split(',').join(' ');
    //   query = query.select(fields);
    // } else {
    //   query = query.select('-__v');
    // }
    //
    // //4)PAGINATION
    // console.log('PAGE: ', req.query.page, 'LIMIT: ', req.query.limit);
    //
    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 5;
    // const skip = (page - 1) * limit;
    //
    // // query = query.skip(2).limit(5);
    //
    // query = query.skip(skip).limit(limit);
    //
    // if (req.query.page) {
    //   const numTours = await Tour.countDocuments();
    //   if (skip > numTours) throw new Error('The page does not exist');
    // }
    //
    // //EXECUTE QUERY
    // console.log(query);
    // console.log('TOUR FIND: ');
    // console.log(typeof Tour.find());

    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
      // requestedAt: req.requestTime,
      // results: tours.length,
      // data: {
      //   tours: tours,
      // },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.createTour = async (req, res) => {
  // const newTour = new Tour({})
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: newTour,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent',
      err_message: err.message,
    });
  }
};
// // console.log(req.body);
// // if (!checkBody(req, res)) return;
// // console.log('Creating new Tour');
// const newId = tours[tours.length - 1].id + 1;
// const newTour = { id: newId, ...req.body };
// tours.push(newTour);
// fs.writeFile(
//   `${__dirname}/dev-data/data/tours.json`,
//   JSON.stringify(tours),
//   () => {
//     res.status(201).json({
//       status: 'success',
//       data: {
//         tour: newTour,
//       },
//     });
//   }

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    //Tour.findOne({ _id: req.params.id })
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// console.log(req.params);
// const id = req.params.id * 1;
// const tour = tours.find((el) => el.id === id);
// res.status(200).json({
//   status: 'success',
//   data: {
//     tour,
//   },
// }););

exports.updateTour = async (req, res) => {
  // const id = req.params.id * 1;
  // if (id > tours.length) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'invalid ID',
  //   });
  // }
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    tour.save();
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          // _id: '$ratingsAverage',
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
      // {
      //   $match: { _id: { $ne: 'EASY' } },
      // },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// module.exports = {}
// const tours = JSON.parse(
//   // eslint-disable-next-line no-undef
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours.json`)
// );

// exports.checkID = (req, res, next, val) => {
//   // console.log('Body: ');
//   // console.dir(req);
//   // console.log(val);
//   if (val > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'invalid ID',
//     });
//   }
//   next();
// };

//Create a checkBody middleware
//Check if body contains the name and price property
//If not, send back 400 (bad request)
//Add it to the post handler stack

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'bad request',
//       message: 'Missing name or price',
//     });
//     // return false
//   }
//   next();
// };
