import { router as authRouter } from './auth/auth.controller';
import { router as eventsRouter } from './events/events.controller';
import { Router } from 'express';

export const router = Router();

router
  .use(authRouter)
  .use('/events', eventsRouter);
