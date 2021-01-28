const express = require('express');

const tourController = require('../controllers/tourController');

const router = express.Router();

// router.param('id', tourController.checkID);

//Create a checkBody middleware
//Check if body contains the name and price property
//If not, send back 400 (bad request)
//Add it to the post handler stack

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;

// router.param('id', (req, res, next, val) => {
//     console.log(`Tour id is ${val}`)
//     next();
//
// })

// db.tours.insertMany([{name: "The Snow Adventurer", price: 997, rating: 4.2, difficulty: "easy"}])
