fs = require('fs');

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours.json`)
);

exports.checkID = (req, res, next, val) => {
    console.log('Body: ')
    console.dir(req)
    console.log(val)
    if  (val > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'invalid ID'
        })
    }
    next();
};

//Create a checkBody middleware
//Check if body contains the name and price property
//If not, send back 400 (bad request)
//Add it to the post handler stack


exports.checkBody = (req, res) => {

        if (!req.body.name || !req.body.price) {
            res.status(400).json({
            status: "bad request",
            message: "Missing name or price"
        })
    // return false
    }
    next();
}

exports.getAllTours = (req, res) => {
    console.log(req.requestTime);
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: tours.length,
        data: {
            tours: tours
        }
    })
}

exports.createTour = (req, res) => {
    // console.log(req.body);
    // if (!checkBody(req, res)) return;
    console.log('Creating new Tour')
    const newId = tours[tours.length -1].id  + 1;
    const newTour = Object.assign({id: newId}, req.body);
    tours.push(newTour);
    fs.writeFile(
        `${__dirname}/dev-data/data/tours.json`,
        JSON.stringify(tours),
        err => {
            res.status(201)
                .json({
                        status: 'success',
                        data: {
                            tour: newTour
                        }
                    }
                );
        } );
};

exports.getTour = (req, res) => {
    console.log(req.params);
    const id = req.params.id * 1;
    const tour = tours.find(el => el.id === id);
    res.status(200).json({
        status: 'success',
        data : {
            tour
        }
    });
};

exports.updateTour = (req, res) => {
    const id = req.params.id * 1;
    if (id > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'invalid ID'
        })
    }
    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated tour here...'
        }
    })
};

exports.deleteTour = (req, res) => {
    res.status(204).json({
        status: 'success',
        data: null
    })
};

// module.exports = {}