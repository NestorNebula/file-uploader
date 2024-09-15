const getIndex = (req, res) => {
  req.user ? res.redirect('/user') : res.redirect('/log-in');
};

module.exports = getIndex;
