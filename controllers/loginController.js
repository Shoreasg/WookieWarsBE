const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const express = require('express')
const User = require('../models/user')
const router = express.Router()
router.use(express.static("public"))


passport.use(new LocalStrategy(User.authenticate())); // use static authenticate method of model in LocalStrategy

router.post('/signup', async (req, res, next) => {
    const findUser = await User.findOne({ username: req.body.username })//when user click signup, this will find the user by the username that they input
    if (!findUser) {//if no user found in DB, register the user.
        await User.register(new User({ username: req.body.username }), req.body.password, (err) => {
            if (err) { //if any error while registering, send the error message(cases like exisitng user name)
                res.status(400)
                res.send(err)
                return next()
            }
            else {
                res.send({ message: "User signup Successful" })
            }
        })

    }
    else {
        res.send({ message: "User signup Error" })
    }
})

router.post('/login', async (req, res, next) => { // this is to login the user
    await passport.authenticate('local', (err, user) => { // check if the user details and password are in our DB
        if (err) { // if error, then send an error
            res.status(400)
            return res.send({ message: err })
        }
        if (!user) { // if user not found, we tell user that the credentials that they entered is incorrect.
            res.status(400)
            return res.send({ message: "Password or username is incorrect" })
        }
        req.logIn(user, (err) => { // else, means user found, we log the user in and tell user that he login successfully
            if (err) { return next(err) }
            next()
            return res.send({ message: "User login Successful" })
        })
    })(req, res, next)

});

router.get('/getlogin', (req, res) => { // this is to check the user session.
    res.send(req.user)
})


router.delete('/logout', (req, res) => { //this will log the user out. Clear the cookies to remove any session

    if (req.session) {
        req.logOut()
        req.session.destroy((err) => {
            if (err) {
                res.send(err)
            } else {
                res.clearCookie('connect.sid')
                res.send({ message: "You are successfully logged out!" })
            }
        })
    }
    else {
        res.send({ message: "You are not logged in!" })
    }
})

module.exports = router