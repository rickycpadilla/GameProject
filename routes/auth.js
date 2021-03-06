var express = require('express');
var router = express.Router();
var passport = require('passport');
var Signup = require('../lib/signup')

router.get('/facebook', passport.authenticate('facebook', {
    scope: 'public_profile'
}));

 router.get('/profile', isLoggedIn, function(req, res) {
    res.cookie('user', req.user.id)
    Signup.findUser(req.user).then(function(user) {
        if (user.rows[0].userName === null || undefined) {
          var input = user.rows[0].image_url;
          var photo = input.replace('$1', '?');
            res.render('pageafterfb', {
                user: user.rows[0],
                photo: photo
            })
        } else {
            res.redirect(`/${user.rows[0].userName}`)
          }
    });
});

router.get('/facebook/callback',
    passport.authenticate('facebook', {
        failureRedirect: '/'
    }),
    function(req, res) {
        res.redirect('/auth/profile');
    });

router.get('/logout', function(req, res) {
    res.clearCookie('user');
    req.logout();
    req.session.destroy(function(err) {
        res.redirect('/');
    });
})

function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();
    // if they aren't redirect them to the home page
    res.redirect('/');
}

module.exports = router;
