import { RequestHandler, Router } from 'express';
import { TypedRequestBody, TypedRequestParams, validateRequestBody, validateRequestParams } from 'zod-express-middleware';
import {
  cancelReservationSchema,
  createEventSchema,
  listEventsSchema,
  reserveTicketSchema,
} from './event.validation';
import * as eventServices from './events.service';
import { StatusCodes } from 'http-status-codes';
import { isAuthenticated } from '../auth/auth.middleware';

export const router = Router();

const reserveTicket: RequestHandler = (req: TypedRequestBody<typeof reserveTicketSchema>, res) => {
  try {
    const reservation = eventServices.reserveTicket({
      userId: req.user!.id, // TODO extend types to support authentication
      eventId: req.params.id,
      data: req.body,
    });
    
    res.send(reservation).status(StatusCodes.CREATED);
  } catch (e) {
    res.json({
      error: e,
    });
  }
};

const createEvent: RequestHandler = async (req: TypedRequestBody<typeof createEventSchema>, res) => {
  try {
    const event = await eventServices.createEvent(req.body);
    res.json({ event }).status(StatusCodes.OK);
  } catch (e) {
    res.json({
      error: e,
    }).status(StatusCodes.FORBIDDEN);
  }
};

const listEvents: RequestHandler = async (req: TypedRequestParams<typeof listEventsSchema>, res) => {
  const events = await eventServices.getEvents(req.params);
  res.send({ events }).status(StatusCodes.OK);
};

const cancelReservation: RequestHandler = async (req: TypedRequestBody<typeof cancelReservationSchema>, res) => {
  try {
    const reservation = await eventServices.cancelReservation(req.body.reservationId);
    res.send({ reservation }).status(StatusCodes.OK);
  } catch (e) {
    res.send({ error: e }).status(StatusCodes.FORBIDDEN);
  }
};

const getBookedEvents: RequestHandler = async (req, res) => {
  const events = await eventServices.getBookedEvents(req.user!.id);
  res.send({ events }).status(StatusCodes.OK);
};


router.get('/', isAuthenticated, validateRequestParams(listEventsSchema), listEvents);
router.post('/', isAuthenticated, validateRequestBody(createEventSchema), createEvent);
router.post('/:eventId/tickets', isAuthenticated, validateRequestBody(reserveTicketSchema), reserveTicket);
router.post('/:eventId/cancel', isAuthenticated, validateRequestBody(cancelReservationSchema), cancelReservation);

// TODO: if there was a profile feature, I would put this there
router.post('/booked', isAuthenticated, getBookedEvents);
