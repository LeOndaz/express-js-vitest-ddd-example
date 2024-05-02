
import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { nanoId } from '../../../db/fields/nanoId';
import { events } from '../../events/models/event';
import { users } from '../../auth/models/user';


export const notifications = pgTable('notifications', {
  id: nanoId('id').primaryKey(),
  content: varchar('content', { length: 255 }).notNull(),
  
  eventId: varchar('event_id').references(() => events.id).notNull(),
  userId: varchar('user_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type NotificationInsert = typeof notifications.$inferInsert;
export type Notification = typeof notifications.$inferSelect;
