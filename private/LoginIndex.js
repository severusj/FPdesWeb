require('dotenv').config();

const express = require('express');
const app = express();
const session = require('express-session');

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET
}));

app.set('view engine','ejs');

const userRoutes = require('./private/routes');

app.use('/',userRoutes);

app.listen(2000, () =>(
    console.log("Corriendo en puerto 2000")
));