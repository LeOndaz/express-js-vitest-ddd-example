import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const handleError = (err: unknown, res: Response) => {
  if (err instanceof Error){
    res.status(StatusCodes.FORBIDDEN).json({ error: err.message });
    return;
  } else if (typeof err === 'object') {
    res.status(StatusCodes.FORBIDDEN).json(err);
    return;
  } else if (typeof err !== 'undefined') {
    res.status(StatusCodes.FORBIDDEN).json({ error: err });
  }
};