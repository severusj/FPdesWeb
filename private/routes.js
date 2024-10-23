const express = require('express');
const router = express();
const passport = require('passport');
require('./passport');

router.use(passport.initialize());
router.use(passport.session());

const userController = require('./controller');

router.get('/', userController.loadAuth);

//Auth
router.get('/auth/google', passport.authenticate('google',{scope: ['email', 'profile']

}));

// Auth CallBack
router.get('/auth/google/callback',
    passport.authenticate('google',{
        successRedirect: '/success',
        failureRedirect: '/failure'
    }));

//success
router.get('/succes' , userController.successGoogleLogin);

//failure
router.get('/failure' , userController.failureGoogleLogin);

module.exports = router;