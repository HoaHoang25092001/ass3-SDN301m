module.exports = {
  notAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      req.flash("error_msg", "Please logout first!");
      res.redirect("/");
    }
    return next();
  },
};
