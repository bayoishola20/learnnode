const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');

exports.loginForm = (req, res) => {
    res.render('login', { title: 'Login' });
}

exports.registerForm = (req, res) => {
    res.render('register', { title: 'Register' });
}

exports.validateRegister = (req, res, next) => {
    req.sanitizeBody('name');
    req.checkBody('name', 'Kindly insert you name').notEmpty();
    req.sanitizeBody('email').normalizeEmail({
        remove_dots: false,
        remove_extension: false,
        gmail_remove_subaddress: false
    });
    req.checkBody('email', 'Invalid email').isEmail();
    req.checkBody('password', 'Password cannot be empty').notEmpty();
    req.checkBody('confirm-password', 'Confirm password cannot be empty').notEmpty();
    req.checkBody('confirm-password', 'Oops! Passwords must match.').equals(req.body.password);

    const errors = req.validationErrors();
    if (errors) {
        req.flash('error', errors.map(err => err.msg));
        res.render('register', { title: 'Register', body: req.body, flashes: req.flash() });

        return; // if errors, returns - which will stop the error from returning
    }
    next(); //there were no errors
}

exports.register = async (req, res, next) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email
    });
    const register = promisify(User.register, User);
    await register(user, req.body.password);
    res.send('It works!');
    next(); // pass to authController.login
}