import { Passport } from 'passport';
import { ExtractJwt, Strategy, StrategyOptionsWithoutRequest } from 'passport-jwt';
import { getUserById } from '@auth/auth.service';
import { env } from '@env/';
import { RequestHandler } from 'express';

const passport = new Passport();

const strategyOpts: StrategyOptionsWithoutRequest = {
  algorithms: ['HS256'],
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  issuer: 'musalasoft.com',
  secretOrKey: env.JWT_SECRET,
};

passport.use(new Strategy(strategyOpts, async function (payload, done) {
  const userId: string = payload.sub;
  let user;

  try {
    user = await getUserById(userId);
  } catch (e) {
    return done(null, false);
  }

  if (!user) {
    return done(null, false);
  }

  return done(null, user);
}));

export const isAuthenticated: RequestHandler = passport.authenticate('jwt', { session: false });