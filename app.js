const express = require('express');
const loginController = require('./controllers/loginController')
const cors = require('cors');
require('dotenv').config();
const passport = require('passport')
const session = require('express-session')
const User = require('./models/user')
const app = express();
app.use(express.json())
app.use(cors({ origin: process.env.FRONTEND_URL, methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD', 'DELETE', 'PATCH'], credentials: true }));
app.enable('trust proxy')

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    proxy : true ,
    // cookie: {sameSite: "none", secure: true}
}));



app.use(passport.initialize());
app.use(passport.session());


// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(loginController)



module.exports = app
