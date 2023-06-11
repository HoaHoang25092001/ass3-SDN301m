const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "username" },
      (username, password, done) => {
        User.findOne({ username: username })
          .then((user) => {
            if (!user) {
              return done(null, false, { message: "Username not exist!" });
            }
            bcrypt.compare(password, user.password, (err, isMatch) => {
              if (err) throw err;

              if (isMatch) {
                return done(null, user);
              } else {
                return done(null, false, { message: "Password incorrect!" });
              }
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    )
  );

  //Hàm được gọi khi xác thực thành công để lưu thông tin user vào session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  //Hàm được gọi bởi passport.session .Giúp ta lấy dữ liệu user dựa vào thông tin lưu trên session và gắn vào req.user
  passport.deserializeUser((id, done) => {
    User.findById(id, (error, user) => {
      done(error, user);
    });
  });
};
