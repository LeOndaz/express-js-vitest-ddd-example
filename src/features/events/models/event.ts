import { pgTable, date, varchar, pgEnum, smallint } from 'drizzle-orm/pg-core';
import { nanoId } from '@db/fields/nanoId';

const categoryEnum = pgEnum('category_enum', ['concert', 'conference', 'game']);

export const events = pgTable('events', {
  id: nanoId('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  date: date('date').notNull(),
  availableAttendeesCount: smallint('available_attendees_count').notNull(), // TODO availableSeats seems like a better name
  description: varchar('description', { length: 500 }).notNull(),
  category: categoryEnum('category_enum').notNull(),
});

export type Event = typeof events.$inferSelect;
export type EventInsert = typeof events.$inferInsert;
