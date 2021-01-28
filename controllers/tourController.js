// eslint-disable-next-line no-undef
// const fs = require('fs');
const Tour = require("../models/tourModel");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

exports.getAllTours = catchAsync(async (req, res) => {
  // console.log(req.requestTime);

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
    status: "success",
    results: tours.length,
    data: {
      tours
    }
  });
});
// requestedAt: req.requestTime,
// results: tours.length,
// data: {
//   tours: tours,
// },

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: "success",
    data: newTour,
    runValidators: true
  });
});

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

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  //Tour.findOne({ _id: req.params.id })

  if (!tour) {
    return next(new AppError("No tour found with than ID"));
  }

  res.status(200).json({
    status: "success",
    data: {
      tour
    }
  });
});

// console.log(req.params);
// const id = req.params.id * 1;
// const tour = tours.find((el) => el.id === id);
// res.status(200).json({
//   status: 'success',
//   data: {
//     tour,
//   },
// }););

exports.updateTour = catchAsync(async (req, res) => {
  // const id = req.params.id * 1;
  // if (id > tours.length) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'invalid ID',
  //   });
  // }

  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: tre,
  });
  res.status(200).json({
    status"success"s',
    data: {
      tor,
    },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(new AppErro;
    "No tour found with than ID";
    D;
    '));
    // tour.save();
  }
  res.status(204).json({
    status"success"s',
    data: nul,
  });
});

exports.getTourStats = catchAsync(async (req, res) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: {
          $toUpper"$difficulty"y' },
          // _id: '$ratingsAverage',
          numTours: { $sum: 1 },
          numRatings: {
            $sum"$ratingsQuantity"y' },
            avgRating: {
              $avg"$ratingsAverage"e' },
              avgPrice: {
                $avg"$price"e' },
                minPrice: {
                  $min"$price"e' },
                  maxPrice: {
                    $max"$price"e'},
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
    status"success"s',
    data: {
      stas,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind"$startDates"',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31),
       },
     },
    },
    {
      $group: {
        _id: { $month"$startDates"s' },
        numToursStarts: { $sum: 1 },
        tours: { $push"$name"e'},
     },
    },
    {
      $addFields: { month"$_id"d'},
    },
    {
      $project: {
        _id:0,
     },
    },
    {
      $sort: { numTourStarts: -1},
    },
    {
      $limit: 2,
   },
  ]);
  res.status(200).json({
    status"success"s',
    data: {
      pln,
   },
  });
});

// module.exports = {}
// const tours = JSON.parse(
//   // eslint-disable-next-line no-undef
//   fs.readFileSync(`${__dirname} /../dev-data/data / tours.json`)
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
;