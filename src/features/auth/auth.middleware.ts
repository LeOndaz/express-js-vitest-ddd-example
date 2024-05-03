import { Passport } from 'passport';
import { Strategy } from 'passport-http-bearer';
import { getUserById, validateToken } from './auth.service';
import { RequestHandler } from 'express';
import { Token } from './models/token';
import { StatusCodes } from 'http-status-codes';

const passport = new Passport();

passport.use(new Strategy(async function (token, done) {
  let user;

  try {
    user = await validateToken(token);
  } catch (e) {
    done(e, false);
    return;
  }

  return done(null, user);
}));


export const isAuthenticated: RequestHandler = async (req, res, next) => {
  return passport.authenticate('bearer', { session: false }, async (err: Error | string, token: Token | undefined) => {
    if (err) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        error: 'invalid token',
      }); 
      return;
    }

    if (!token) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        error: 'unauthorized access',
      });
      return;
    }
  
    try {
      req.user = await getUserById(token.userId);
      next();
    } catch (e) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        error: 'user does not exist', // account deleted, but he created a token before
      });
    }
  })(req, res, next);
};