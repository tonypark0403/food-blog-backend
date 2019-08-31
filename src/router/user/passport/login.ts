import passport from "passport";
import { RequestHandler } from "express";

export const tryLocalLogin: RequestHandler = (req, res, next) => {
  passport.authenticate("local", function(err, user, info) {
    try {
      if (err) {
        throw err;
      }
      if (!user) {
        throw info.message;
      }
      req.login(user, loginErr => {
        if (loginErr) {
          throw loginErr;
        }
        next();
      });
    } catch (err) {
      res.status(400).send({ error: err });
    }
  })(req, res, next);
};

export const tryGoogleLogin: RequestHandler = (req, res, next) => {
  passport.authenticate(
    "google",
    {
      scope: ["https://www.googleapis.com/auth/plus.login", "email"],
      state: req.query.redirectURL
    },
    function(err, user, info) {
      try {
        if (err) {
          throw err;
        }
        if (!user) {
          throw info;
        }
        req.login(user, loginErr => {
          if (loginErr) {
            throw loginErr;
          }
          next();
        });
      } catch (err) {
        res.status(400).send({ error: err });
      }
    }
  )(req, res, next);
};
