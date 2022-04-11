const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');
const honeyBadgerController = require('../controllers/honeyBadgerController');
const adminController = require('../controllers/adminController');


const { catchErrors } = require('../handlers/errorHandlers');
// formatting as below tells express to use index file in the folder
const middleWare = require('../middleware/middleWare');
const { Router } = require('express');

// ADMIN ROUTES
router.get('/admin', authController.isUberUser, adminController.admin);
router.post('/adminProfileEdit', authController.isUberUser, adminController.adminProfileEdit);

// GENERAL ROUTES
router.get('/', controller.homePage);
router.get('/quoteGet', authController.isUberUser, catchErrors(controller.quoteForm));
router.post('/quoteSave', catchErrors(controller.quoteCreate));
router.get('/error', controller.error);

// CONTACT ROUTES
router.get('/contacts', catchErrors(controller.contactsGet));
router.get('/contacts/:id/edit', catchErrors(controller.contactEdit));
router.get('/contactAdd', authController.isLoggedIn, catchErrors(controller.contactAdd));
router.post('/contactAdd', catchErrors(controller.contactCreate));
router.post('/contactAdd/:id', catchErrors(controller.contactUpdate));

// VACATION ROUTES
router.get('/vacation', authController.isLoggedIn, catchErrors(controller.vacationGet));
router.get('/vacationAdd', catchErrors(controller.vacationAdd));
router.get('/vacation/:id/edit', catchErrors(controller.vacationEdit));
router.post('/vacationEdit', catchErrors(controller.vacationCreate));
router.post('/vacationEdit/:id', catchErrors(controller.vacationUpdate));
router.get('/vacation/:id/delete',
    authController.isLoggedIn,
    catchErrors(controller.vacationDelete)
);

// HONEYBADGER routes
router.get('/honeyBadger', catchErrors(honeyBadgerController.honeyBadgerDisplay));
router.get('/honeyBadgerAdd', authController.isUberUser, catchErrors(honeyBadgerController.honeyBadgerAdd));
router.get('/honeyBadger/:id/edit',
    authController.isUberUser,
    catchErrors(honeyBadgerController.honeyBadgerEdit));
router.get('/honeyBadger/:id/delete',
    authController.isUberUser,
    catchErrors(honeyBadgerController.honeyBadgerDelete));
router.post('/honeyBadgerEdit',
    authController.isLoggedIn,
    catchErrors(honeyBadgerController.honeyBadgerCalculate),
    catchErrors(honeyBadgerController.honeyBadgerCreate)
);
router.post('/honeyBadgerEdit/:id',
    authController.isLoggedIn,
    catchErrors(honeyBadgerController.honeyBadgerCalculate),
    catchErrors(honeyBadgerController.honeyBadgerUpdate)
);

// RESOURCES ROUTES
router.get('/resources', catchErrors(controller.resourcesGet));
router.get('/resourceAdd', authController.isUberUser, catchErrors(controller.resourceAdd));
router.get('/resources/:id/edit', authController.isUberUser, catchErrors(controller.resourceEdit));
router.get('/resources/:id/delete', authController.isUberUser, catchErrors(controller.resourceDelete));
router.post('/resourceEdit', catchErrors(controller.resourceCreate));
router.post('/resourceEdit/:id', catchErrors(controller.resourceUpdate));

// AUTHENTICATION & AUTHORIZATION ROUTES
// router.get('/register', middleWare.adminLoggedIn, catchErrors(controller.registerGet));
// router.get('/profile', catchErrors(controller.profileGet));
// router.get('/login', middleWare.loggedOut, catchErrors(controller.loginGet));
// router.post('/login', catchErrors(controller.loginPost));
// router.get('/logout', middleWare.requiresLogin, catchErrors(controller.logout));
// router.post('/register', catchErrors(controller.registerPost));

// LOCATION ROUTES
router.get('/sites', catchErrors(controller.sitesDisplay));
router.get('/sites/page/:page', catchErrors(controller.sitesDisplay));

router.get('/siteAdd', catchErrors(controller.siteAddGet));
router.get('/sites/:id/edit', catchErrors(controller.siteEditDisplay));
router.get('/sites/:id/delete', catchErrors(controller.siteDelete));
router.post('/siteAdd', 
    controller.upload,
    catchErrors(controller.resize),
    catchErrors(controller.siteAddPost));
router.post('/siteAdd/:id', 
    controller.upload,
    catchErrors(controller.resize),
    catchErrors(controller.siteEditUpdate));

router.get('/site/:slug', catchErrors(controller.getSiteBySlug));
router.post('/reviews/:id',
    authController.isLoggedIn,
    catchErrors(reviewController.addReview));
router.get('/top', catchErrors(reviewController.getTopSites));

// TAG ROUTES
router.get('/tags', catchErrors(controller.getSitesByTag));
router.get('/tags/:tag', catchErrors(controller.getSitesByTag));

// PASSPORT LOGIN ROUTES
router.get('/loginPassport', userController.loginForm);
router.post('/loginPassport', authController.login);
router.get('/register', authController.isUberUser, userController.registerForm);
router.post('/register',
    userController.validateRegister,
    userController.register,
    authController.login
);
router.get('/logoutPassport', authController.logout);
router.get('/profileDisplay',
    authController.isLoggedIn,
    userController.profileDisplay
);
router.get('/profileEdit', authController.isUberUser, userController.profileEdit);
router.get('/profileEdit/:id', catchErrors(userController.profileEdit));
router.post('/profileEdit', authController.isUberUser, catchErrors(userController.profileUpdate));
router.post('/account/forgot', catchErrors(authController.forgot));
router.get('/account/reset/:token', catchErrors(authController.reset));
router.post('/account/reset/:token',
    authController.confirmedPasswords,
    catchErrors(authController.update)
);

// MAP ROUTES
router.get('/map', catchErrors(controller.mapPage));

// HEART ROUTES
router.get('/hearts', authController.isLoggedIn, catchErrors(controller.getHearts));

// API
router.get('/api/siteSearch', catchErrors(controller.searchSites));
router.get('/api/contactSearch', catchErrors(controller.searchContacts));
router.get('/api/sites/near', catchErrors(controller.mapSites));
router.post('/api/sites/:id/heart', catchErrors(controller.heartSite));

// SMS
router.get('/sms', catchErrors(controller.smsGet));
router.post('/sms', catchErrors(controller.smsPost));

module.exports = router;