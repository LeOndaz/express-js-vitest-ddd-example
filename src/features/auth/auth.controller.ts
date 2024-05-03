import { RequestHandler, Router } from 'express';
import { TypedRequestBody, validateRequestBody } from 'zod-express-middleware';
import { registerSchema, loginSchema } from './auth.validation';
import { StatusCodes } from 'http-status-codes';
import * as authService from './auth.service';
import { logger } from '../../common/utils/logger';

export const router = Router();


const registerUser: RequestHandler = async (req: TypedRequestBody<typeof registerSchema>, res, next) => {
  try {
    const user = await authService.createUser(req.body);
    res.status(StatusCodes.CREATED).send({ user });
  } catch (e) {
    logger.error(e);
    next(e);
  }
};

const loginUser: RequestHandler = async (req: TypedRequestBody<typeof loginSchema>, res, next) => {
  try {
    const token = await authService.login(req.body.email, req.body.password);
    res.status(StatusCodes.OK).send({ token });
  } catch (e) {
    logger.error(e);
    next(e);
  }
};

router.post('/users', validateRequestBody(registerSchema), registerUser);
router.post('/auth', validateRequestBody(loginSchema), loginUser);