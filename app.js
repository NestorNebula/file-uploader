const express = require('express');
const app = express();
const path = require('node:path');
require('dotenv').config();
const signupRouter = require('./routes/signupRouter');
const loginRouter = require('./routes/loginRouter');
const newRouter = require('./routes/newRouter');
const indexController = require('./controllers/indexController');
const userController = require('./controllers/userController');
const fileController = require('./controllers/fileController');
const session = require('express-session');
const passport = require('passport');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client');
const flash = require('connect-flash');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);
app.use(flash());
app.use(passport.session());
require('./modules/passport-config');
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.get('/', indexController);
app.use('/sign-up', signupRouter);
app.use('/log-in', loginRouter);
app.use((req, res, next) => {
  req.user ? next() : res.redirect('/log-in');
});
app.get('/user', userController);
app.get('/user/:folder/:file', fileController);
app.use('/new', newRouter);

app.listen(process.env.PORT);
