import { RequestHandler, Router } from 'express';
import { TypedRequestBody, TypedRequestParams, validateRequestBody, validateRequestParams } from 'zod-express-middleware';
import {
  createEventSchema,
  listEventsSchema,
  reserveTicketSchema,
} from './event.validation';
import * as eventServices from './events.service';
import { StatusCodes } from 'http-status-codes';
import { isAuthenticated } from '../auth/auth.middleware';
import { logger } from '../../common/utils/logger';

export const router = Router();

const reserveTicket: RequestHandler = async (req: TypedRequestBody<typeof reserveTicketSchema>, res, next) => {
  try {
    const reservation = await eventServices.reserveTicket({
      userId: req.user!.id, // TODO extend types to support authentication
      eventId: req.params.eventId,
      data: req.body,
    });
  
    res.send(reservation).status(StatusCodes.CREATED);
  } catch (e) {
    logger.error(e);
    next(e);
  }
};

const createEvent: RequestHandler = async (req: TypedRequestBody<typeof createEventSchema>, res, next) => {
  try {
    const event = await eventServices.createEvent(req.body);
    res.json({ event }).status(StatusCodes.OK);
  } catch (e) {
    logger.error(e);
    next(e);
  }
};

const listEvents: RequestHandler = async (req: TypedRequestParams<typeof listEventsSchema>, res, next) => {
  try {
    const events = await eventServices.getEvents(req.params);
    res.send({ events }).status(StatusCodes.OK);
  } catch (e) {
    logger.error(e);
    next(e);
  }
};

const cancelReservation: RequestHandler = async (req, res, next) => {
  try {
    const reservation = await eventServices.cancelReservation(req.user!, req.params.eventId);
    res.send({ reservation }).status(StatusCodes.OK);
  } catch (e) {
    logger.error(e);
    next(e);
  }
};

const getBookedEvents: RequestHandler = async (req, res, next) => {
  try {
    const events = await eventServices.getBookedEvents(req.user!.id);
    res.send({ events }).status(StatusCodes.OK);
  } catch (e) {
    next(e);
  }
};


router.get('/', isAuthenticated, validateRequestParams(listEventsSchema), listEvents);
router.post('/', isAuthenticated, validateRequestBody(createEventSchema), createEvent);
router.post('/:eventId/tickets', isAuthenticated, validateRequestBody(reserveTicketSchema), reserveTicket);
router.post('/:eventId/cancel', isAuthenticated, cancelReservation);

// TODO: if there was a profile feature, I would put this there
router.get('/booked', isAuthenticated, getBookedEvents);
