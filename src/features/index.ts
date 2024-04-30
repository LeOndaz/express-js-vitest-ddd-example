import authController from '@auth/auth.controller';
import eventsController from '@events/events.controller';
import { Router } from 'express';

export const router = Router();

router
  .use(authController)
  .use(eventsController);