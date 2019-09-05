import passport from "passport";
import passportLocal from "passport-local";
import { User } from "../userModel";
import bcrypt from "bcrypt";
import passportGoogle from "passport-google-oauth";

const LocalStrategy = passportLocal.Strategy;
const GoogleStrategy: any = passportGoogle.OAuth2Strategy;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
          throw `Email ${email} not found.`;
        }
        if (!user.password) {
          throw `Email ${email} is not local user`;
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          throw "Invalid email or password.";
        }
        console.log("*** IN passport, passport user : ", user);
        done(undefined, user);
      } catch (err) {
        done(err, false);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      passReqToCallback: true,
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `/user/google`
    },
    async function(
      req: any,
      accessToken: any,
      refreshToken: any,
      profile: any,
      done: any
    ) {
      try {
        const user = await User.findOne({ email: profile._json.email });
        if (!user) {
          const register = new User({
            name: profile._json.name,
            email: profile._json.email,
            picture: profile._json.picture
          });
          const savedUser = await register.save();
          if (savedUser) {
            done(undefined, savedUser);
          }
        }
        done(undefined, user);
      } catch (err) {
        done(err, false);
      }
    }
  )
);
