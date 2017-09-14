const passport = require('passport');
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');
const mail = require('../handlers/mail');

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
    const user = await User.findOne({ email: req.body.email });
    if(!user) {
        req.flash('error', 'Sorry, user not found.');
        return res.redirect('/login');
    }
    // Set reset tokens and expiry on user's account
    user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordExpires = Date.now() + 3600000; //I hour from now
    await user.save();
    //Send an email containing the token
    const resetURL = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`;
    await mail.send({
        user,
        subject: 'Password reset',
        resetURL: resetURL
    });
    req.flash('success', `Kindly check your email to reset your password.`);
    //redirect to login
    res.redirect('/login');
}

exports.reset = async (req, res) => {
    //check if token exists and if not expired
    // res.json(req.params);
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
    });
    if(!user){
        req.flash('error', 'Password reset token is invalid or expired');
        return res.redirect('/login');
    }
    // if user exists, show reset password form
    res.render('reset', { title: 'Reset your password' });
}

exports.confirmedPasswords = (req, res, next) => {
    if (req.body.password === req.body['confirm-password']){
        next(); //keep going
        return;
    }
    req.flash('error', 'Passwords do not match!');
    res.redirect('back');
};

//If they do match, update
exports.update = async (req, res) => {
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if(!user){
        req.flash('error', 'Password reset token is invalid or expired');
        return res.redirect('/login');
    }

    const setPassword = promisify(user.setPassword, user);
    await setPassword(req.body.password);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    const updatedUser = await user.save();
    await req.login(updatedUser);
    req.flash('success', 'Password reset complete.');
    res.redirect('/');
}