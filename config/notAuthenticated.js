var jwt = require("jsonwebtoken");

var config = require("./config");

module.exports = {
  cookieNotAuthenticated: function (req, res, next) {
    if (req.cookies.accessToken) {
      var accessToken = req.cookies.accessToken;
      var checkTokenValid = jwt.verify(accessToken, config.secretKey);
      if (checkTokenValid) {
        req.flash("error_msg", "Please logout first!");
        res.redirect("/");
      }
    }
    return next();
  },
};
