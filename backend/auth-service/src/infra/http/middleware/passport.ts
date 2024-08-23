import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User, { IUser } from '../../databases/mongoose/models/User';
import Publisher from '../../../infra/messaging/rabbitmq/Publisher';

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: `${process.env.GATEWAY_ORIGIN}/auth/google/callback`
},
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ email: profile.emails?.[0].value });
      if (!user) {
        user = new User({
          username: profile.displayName,
          email: profile.emails?.[0].value,
          isPassportVerified: true,
          image: profile.photos?.[0].value,
          favourites: [],
          subscribed: []
        });
        await user.save();
        const publisher = await Publisher.getInstance();
        await publisher.publish('user.registration.fanout', JSON.stringify({
          email: user.email,
          username: user.username,
          image: user.image,
          _id: user._id
        }));
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
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
