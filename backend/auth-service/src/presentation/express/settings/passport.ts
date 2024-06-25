import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '../../../config';
import { UserRepository } from '../../../app/repositories/UserRepository';
import { TokenManager } from '../../../app/providers/TokenManager';

export const configurePassport = (userRepository: UserRepository, tokenManager: TokenManager) => {
  passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/api/auth/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await userRepository.findByEmail(profile.emails[0].value);
      if (!user) {
        user = await userRepository.create({
          email: profile.emails[0].value,
          name: profile.displayName,
          googleId: profile.id
        });
      }
      const token = tokenManager.generate({ userId: user.id });
      return done(null, { user, token });
    } catch (error) {
      return done(error as Error, undefined);
    }
  }));

  return passport;
};