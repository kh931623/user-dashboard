const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const RedisStore = require('connect-redis').default;
const session = require('express-session');
const {createClient} = require('redis');

// routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');

const cookieSecret = 'cookie secret';

// Initialize client.
const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.connect().catch(console.error);

// Initialize store.
const redisStore = new RedisStore({
  client: redisClient,
  prefix: 'user-dashboard:',
  disableTTL: true, // preserve all sessions for stats purpose
});

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(cookieSecret));
app.use(express.static(path.join(__dirname, 'public')));

// Initialize session storage.
app.use(
    session({
      store: redisStore,
      resave: false, // required: force lightweight session keep alive (touch)
      // recommended: only save session when data exists
      saveUninitialized: false,
      secret: cookieSecret,
      cookie: {
        maxAge: 30 * 60 * 1000, // 30 mins
      },
    }),
);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
