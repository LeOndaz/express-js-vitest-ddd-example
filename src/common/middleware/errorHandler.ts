import { ErrorRequestHandler } from 'express';
import { handleError } from '../utils/handleError';


export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  handleError(err, res);
};