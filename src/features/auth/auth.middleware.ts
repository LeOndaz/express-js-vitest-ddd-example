import { Passport } from 'passport';
import { Strategy } from 'passport-http-bearer';
import { validateToken } from './auth.service';
import { RequestHandler } from 'express';

const passport = new Passport();

passport.use(new Strategy(async function (token, done) {
  let user;

  try {
    user = await validateToken(token);
  } catch (e) {
    done(new Error('invalid token'), false);
    return;
  }

  return done(null, user);
}));

export const isAuthenticated: RequestHandler = passport.authenticate('bearer', { session: false });