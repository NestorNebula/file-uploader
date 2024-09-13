const express = require('express');
const app = express();
const path = require('node:path');
require('dotenv').config();
const signupRouter = require('./routes/signupRouter');
const loginRouter = require('./routes/loginRouter');
const newfileRouter = require('./routes/newfileRouter');
const indexController = require('./controllers/indexController');
const userController = require('./controllers/userController');
const fileController = require('./controllers/fileController');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', indexController);
app.use('/sign-up', signupRouter);
app.use('/log-in', loginRouter);
app.get('/user', userController);
app.get('/user/:folder/:file', fileController);
app.use('/new-file', newfileRouter);

app.listen(process.env.PORT);
