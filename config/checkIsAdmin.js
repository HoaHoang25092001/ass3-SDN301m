var jwt = require("jsonwebtoken");
const config = require("./config");

module.exports = function (req, res, next) {
  var data = jwt.verify(req.cookies.accessToken, config.secretKey);
  console.log(data);
  if (isAdmin) {
    return true;
  }
  return false;
};
