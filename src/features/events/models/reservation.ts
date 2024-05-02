import { pgTable, smallint, timestamp, unique, varchar } from 'drizzle-orm/pg-core';
import { nanoId } from '../../../db/fields/nanoId';
import { users } from '../../auth/models/user';
import { events } from './event';

export const reservations = pgTable('reservations', {
  id: nanoId('id').primaryKey(),
	
  userId: varchar('user_id').references(() => users.id).notNull(),
  eventId: varchar('event_id').references(() => events.id).notNull(),
  attendeesCount: smallint('attendees_count').notNull(),
	
  reservedAt: timestamp('reserved_at').defaultNow(),

}, (table) => {
  return {
    userReservationPerEvent: unique('user_reservation_per_event').on(table.userId, table.eventId),
  };
});

export type Reservation = typeof reservations.$inferSelect;
export type ReservationInsert = typeof reservations.$inferInsert;
