import { RequestHandler, Router } from 'express';
import { TypedRequestBody, validateRequestBody } from 'zod-express-middleware';
import { registerSchema, loginSchema } from '@auth/auth.validation';
import { StatusCodes } from 'http-status-codes';

const router = Router();


const registerUser: RequestHandler = (req: TypedRequestBody<typeof registerSchema>, res) => {
  res.json(req.body).status(StatusCodes.OK);
};

const loginUser: RequestHandler = (req: TypedRequestBody<typeof registerSchema>, res) => {
  res.json(req.body).status(StatusCodes.OK);
};

router.post('/users', validateRequestBody(registerSchema), registerUser);
router.post('/auth', validateRequestBody(loginSchema), loginUser);

export default router;