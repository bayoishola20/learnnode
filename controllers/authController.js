const passport = require('passport');

//strategy to check if you are allowed to log in.
//local or facebook or github,....
exports.login = passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: 'Access denied',
    successRedirect: '/',
    successFlash: 'Logged in'
});

exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'You are now logged out');
    res.redirect('/');
}

//protecting routes. Only opens to logged in user.
exports.thisLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        next(); //continue.. User is logged in
        return;
    }
    req.flash('error', 'You need to be logged in')
    res.redirect('/login');
}