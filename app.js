const express = require('express');
const app = express();
const path = require('node:path');
require('dotenv').config();
const signupRouter = require('./routes/signupRouter');
const loginRouter = require('./routes/loginRouter');
const newRouter = require('./routes/newRouter');
const indexController = require('./controllers/indexController');
const userRouter = require('./routes/userRouter');
const updateController = require('./controllers/updateController');
const deleteController = require('./controllers/deleteController');
const shareRouter = require('./routes/shareRouter');
const session = require('express-session');
const passport = require('passport');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client');
const flash = require('connect-flash');
const Sperror = require('sperror');

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
app.use('/share', shareRouter);
app.use((req, res, next) => {
  req.user ? next() : res.redirect('/log-in');
});
app.use('/user', userRouter);
app.use('/new', newRouter);
app.post('/update', updateController);
app.post('/delete', deleteController);

app.use((req, res, next) => {
  next(new Sperror('Page not found', "This page doesn't exist.", 404));
});
app.use((err, req, res, next) => {
  err instanceof Sperror
    ? next(err)
    : next(
        new Sperror('Unknown Error', 'The app faced an unknown error.', 500)
      );
});
app.use((err, req, res, next) => {
  res.render('error', { err });
});

app.listen(process.env.PORT);
