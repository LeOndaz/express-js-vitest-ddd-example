import { logger } from '../../common/utils/logger';
import { getEvents, getReservations } from '../events/events.service';
import * as fns from 'date-fns';

export const sendEventNotifications = async () => {
  const yesterday = fns.subDays(new Date(), 1);
  
  // TODO: can be better using batch processing instead of querying all events
  const events = await getEvents({
    startDate: fns.startOfDay(yesterday).toDateString(),
  });
  
  const reservations = await getReservations();
  
  logger.log(reservations);
};