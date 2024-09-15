const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const prisma = require('../models/queries');

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await prisma.getUserByUsermail(username);
      if (!user) {
        return done(null, false, { message: 'Incorrect username/email' });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: 'Incorrect password' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.getUserById(id);
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});
