import { RequestHandler, Router } from 'express';
import { TypedRequestBody, validateRequestBody } from 'zod-express-middleware';
import { registerSchema, loginSchema } from './auth.validation';
import { StatusCodes } from 'http-status-codes';
import * as authService from './auth.service';
import { logger } from '../../common/utils/logger';
import { isApiError } from '../../common/utils/isApiError';

export const router = Router();


const registerUser: RequestHandler = async (req: TypedRequestBody<typeof registerSchema>, res) => {
  try {
    const user = await authService.createUser(req.body);
    res.send({ user }).status(StatusCodes.CREATED);
  } catch (e: unknown) {
    // TODO: should be handled in middleware error handler
    if (isApiError(e)) {
      res.send({ error: e.message }).status(StatusCodes.FORBIDDEN);
      return;
    }
    
    logger.error(e);
    res.send({ error: 'unknown error has occcurred' }).status(StatusCodes.FORBIDDEN);
  }
};

const loginUser: RequestHandler = async (req: TypedRequestBody<typeof loginSchema>, res) => {
  try {
    const token = await authService.login(req.body.email, req.body.password);
    res.send({ token }).status(StatusCodes.OK);
  } catch (e: unknown) {
    // TODO: should be handled in middleware error handler
    if (isApiError(e)) {
      res.send({ error: e.message }).status(StatusCodes.FORBIDDEN);
      return;
    }

    logger.error(e);
    res.send({ error: 'unknown error has occcurred' }).status(StatusCodes.FORBIDDEN);
  }
};

router.post('/users', validateRequestBody(registerSchema), registerUser);
router.post('/auth', validateRequestBody(loginSchema), loginUser);