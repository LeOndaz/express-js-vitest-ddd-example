import { ErrorRequestHandler } from 'express';
import { handleError } from '../utils/handleError';


// Express requires 4 variables to denote this as an error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars 
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  handleError(err, res);
};