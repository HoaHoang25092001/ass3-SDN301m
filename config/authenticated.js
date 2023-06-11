var jwt = require("jsonwebtoken");

var config = require("./config");

module.exports = {
  cookieAuthenticated: function (req, res, next) {
    if (req.cookies.accessToken) {
      var accessToken = req.cookies.accessToken;
      var checkTokenValid = jwt.verify(accessToken, config.secretKey);
      if (checkTokenValid) {
        return next();
      }
    }
    req.flash("error_msg", "Please login first!");
    res.redirect("/auth");
  },
};
