var express = require('express'),
  appUserCtrl = require('../controllers/app-user/User'),
  router = express.Router()
router.route('/place').post(appUserCtrl.places);
router.route('/more-places').post(appUserCtrl.morePlaces);
router.route('/details').post(appUserCtrl.details);
router.route('/yelp-reviews').post(appUserCtrl.yelpReviews);

module.exports = router;
