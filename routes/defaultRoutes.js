const express = require('express');
const router = express.Router();
const defaultController = require('../controllers/defaultController');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/UserModel').User;


passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    User.findOne({ email: email }).then(user => {
        if (!user) {
            return done(null, false, req.flash('error-message', 'User not found with this email.'));
        }
        bcrypt.compare(password, user.password, (err, passwordMatched) => {
            if (err) {
                return err;
            }
            if (!passwordMatched) {
                return done(null, false, req.flash('error-message', 'Invalid Username or Password'));
            }
            return done(null, user, req.flash('success-message', 'Login Successful'));

        })
    })
}))
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});
/* Routes */
router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'default';
    next();
})

router.route('/')
    .get(defaultController.index);

router.route('/login')
    .get(defaultController.loginGet)
    .post(passport.authenticate('local', {
        successRedirect: '/admin',
        failureRedirect: '/login',
        failureFlash: true,
        successFlash: true,
        session: true
    }), defaultController.loginPost);

router.route('/register')
    .get(defaultController.resgisterGet)
    .post(defaultController.resgisterPost);

router.route('/post/:id')
    .get(defaultController.singlePost)
    .post(defaultController.submitComment)


router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success-message', 'Logout was successful');
    res.redirect('/');
});



module.exports = router;