'use strict';

let express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    passport = require('passport'),
    morgan = require('morgan');

require('../helpers/passport')(passport);

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(passport.initialize());
//app.use(passport.session());

let router = express.Router();
app.use(router);

// Log requests to console
router.use(morgan('dev'));

//Implements CORS
router.all('/*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', "GET,PUT,POST,DELETE,OPTIONS");

    res.header('Access-Control-Allow-Headers', "Content-Type, Authorization, Content-Length, X-Requested-With,X-Custom-Header,Origin");
    res.header('Access-Control-Allow-Credentials', "true");
    if ('OPTIONS' === req.method) {
        res.status(200).send();
    }
    else {
        next();
    }
});

// Import Controllers
let userCtrl = require('../controllers/userController');
let restaurantCtrl = require('../controllers/restaurantController');

// API routes
router.route('/register')
    .post(userCtrl.addUser);
    
router.route('/authenticate')
    .post(userCtrl.signIn);

router.route('/user')
    .get(passport.authenticate('jwt', { session: false }), userCtrl.findAllUsers)
    .post(passport.authenticate('jwt', { session: false }), userCtrl.addUser)
    .delete(passport.authenticate('jwt', { session: false }), userCtrl.deleteUserById)
    .put(passport.authenticate('jwt', { session: false }), userCtrl.updateUserById);

router.route('/user/:username')
    .get(passport.authenticate('jwt', { session: false }), userCtrl.findUser);

router.route('/restaurant')
    .get(restaurantCtrl.findAllRestaurant)
    .post(restaurantCtrl.addRestaurant)
    .delete(restaurantCtrl.deleteRestaurantById)
    .put(restaurantCtrl.updateRestaurantById);

module.exports = app;
