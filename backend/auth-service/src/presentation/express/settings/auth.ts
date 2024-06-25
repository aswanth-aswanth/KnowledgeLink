import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: "http://localhost:5000/auth/google/callback",
},
    function (accessToken: string, refreshToken: string, profile: any, done: any) {
        const token = jwt.sign(
            { id: profile.id, email: profile.emails[0].value },
            process.env.JWT_SECRET as string,
            { expiresIn: '1h' }
        );
        done(null, { profile, token });
    }
));

export default passport;