const passport = require('passport');
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = mongoose.model('User');

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

// forgot password
exports.forgot = async (req, res) => {
    // Check if email exists
    const user = await user.findOne({ email: req.body.email });
    if(!user) {
        req.flash('error', 'Sorry, user not found.');
        return res.redirect('/login');
    }
    // Set reset tokens and expiry on user's account
    user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordExpires = Date.now() + 3600000; //I hour from now
    await user.save();
    //Send an email containing the token
    //redirect to login
}