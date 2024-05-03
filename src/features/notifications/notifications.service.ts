import { db } from '../../db';
import { reservations } from '../events/models/reservation';
import { eq, gt, isNull, lt, max, or, sql } from 'drizzle-orm';
import { events } from '../events/models/event';
import { NotificationInsert, notifications } from './models/notification';

export const sendEventNotifications = async () => {
  // TODO: can be better using batch processing instead of querying all events
  // TODO uses SQL directly, no helpers, no N+1 ;)

  const unNotifiedReservations = await db.select({
    userId: reservations.userId,
    eventId: reservations.eventId,
    lastNotificationDate: max(notifications.createdAt),
  })
    .from(reservations)
    .leftJoin(events, eq(reservations.eventId, events.id))
    .leftJoin(notifications, eq(notifications.eventId, events.id))
    .where(
      gt(events.date, new Date().toDateString()),
    )
    .groupBy(reservations.userId, reservations.eventId)
    .having(({ lastNotificationDate }) => 
      or(
        isNull(lastNotificationDate),
        lt(lastNotificationDate, sql`current_date`),
      ),
    )
    .execute();
  
  const notificationsData: NotificationInsert[] = unNotifiedReservations.map(({ eventId, userId, lastNotificationDate }) => {
    return {
      eventId,
      userId,
      content: 'Your reservation is upcoming!',
    };
  });
  
  await db.insert(notifications).values(notificationsData);
};