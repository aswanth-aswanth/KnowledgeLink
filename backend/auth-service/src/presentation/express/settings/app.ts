import express from 'express';
import session from 'express-session';
import passport from '../../../infra/http/middleware/passport';
import authRouter from '../routers/auth';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware setup
app.use(express.json());

// Session setup
app.use(session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: true
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRouter);

export default app;
