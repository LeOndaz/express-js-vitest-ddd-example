import { RequestHandler, Router } from 'express';
import { TypedRequestBody, TypedRequestParams, validateRequestBody, validateRequestParams } from 'zod-express-middleware';
import {
  createEventSchema,
  listEventsSchema,
  reserveTicketSchema,
} from '@events/event.validation';
import * as eventServices from '@events/events.service';
import { StatusCodes } from 'http-status-codes';
import { isAuthenticated } from '@auth/auth.middleware';

const router = Router();

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

const createEvent: RequestHandler = (req: TypedRequestBody<typeof createEventSchema>, res) => {
  try {
    const event = eventServices.createEvent(req.body);
    res.json(event).status(StatusCodes.OK);
  } catch (e) {
    res.json({
      error: e,
    }).status(StatusCodes.FORBIDDEN);
  }
};

const listEvents: RequestHandler = (req: TypedRequestParams<typeof listEventsSchema>, res) => {
  const events = eventServices.getEvents(req.params);
  res.send({ events }).status(StatusCodes.OK);
};


router.get('/events', isAuthenticated, validateRequestParams(listEventsSchema), listEvents);
router.post('/events', isAuthenticated, validateRequestBody(createEventSchema), createEvent);
router.post('/events/:eventId/tickets', isAuthenticated, validateRequestBody(reserveTicketSchema), reserveTicket);

export default router;