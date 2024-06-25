import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User, { IUser } from '../../databases/mongoose/models/User';

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: '/auth/google/callback'
},
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ email: profile.emails?.[0].value });
      console.log("user : ", user);
      if (!user) {
        user = new User({
          username: profile.displayName,
          email: profile.emails?.[0].value,
          isPassportVerified: true,
          favourites: [],
          subscribed: []
        });
        await user.save();
      }

      done(null, user);
    } catch (error) {
      done(error);
    }
  }));

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    console.log("user deserialize : ", user);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
