const getLogin = (req, res) => {
  res.render('log-in', { error: req.flash('error') });
};

module.exports = { getLogin };
