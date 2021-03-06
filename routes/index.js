const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const reviewController = require('../controllers/reviewsController')

const { catchErrors } = require('../handlers/errorHandlers');

// Do work here
router.get('/', storeController.homePage);
router.get('/stores', catchErrors(storeController.getStores));
router.get('/stores/page/:page', catchErrors(storeController.getStores));
router.get('/add', authController.thisLoggedIn ,storeController.addStore); //check if logged in before granting below rights.

//add store
router.post('/add',
    storeController.upload,
    catchErrors(storeController.resize),
    catchErrors(storeController.createStore)
);
router.post('/add/:id',
    storeController.upload,
    catchErrors(storeController.resize),
    catchErrors(storeController.updateStore));

router.get('/stores/:id/edit', catchErrors(storeController.editStore));
router.get('/store/:slug', catchErrors(storeController.getStoreBySlug));

router.get('/tags', catchErrors(storeController.getStoresByTag));
router.get('/tags/:tag', catchErrors(storeController.getStoresByTag));

router.get('/login', userController.loginForm);
router.post('/login', authController.login);


router.get('/register', userController.registerForm);

router.post('/register',
    userController.validateRegister,
    userController.register,
    authController.login
);

router.get('/logout', authController.logout);

router.get('/account', authController.thisLoggedIn, userController.account);

router.post('/account', catchErrors(userController.updateAccount));

router.post('/account/forgot', catchErrors(authController.forgot));

router.get('/account/reset/:token', catchErrors(authController.reset));

router.post('/account/reset/:token', authController.confirmedPasswords, catchErrors(authController.update));

router.get('/map', storeController.mapPage);

router.get('/hearts', authController.thisLoggedIn, catchErrors(storeController.getHearts));
router.post('/reviews/:id', authController.thisLoggedIn, catchErrors(reviewController.addReview));

//Top stores rating
router.get('/top', catchErrors(storeController.getTopStores));

// API endpoints
router.get('/api/search', catchErrors(storeController.searchStores));
router.get('/api/stores/close-stores', catchErrors(storeController.mapStores));
router.post('/api/stores/:id/heart', catchErrors(storeController.heartStore));

module.exports = router;