import { pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { nanoId } from '../../../db/fields/nanoId';
import { users } from './user';


const tokenLength = 40;

export const tokens = pgTable('tokens', {
  value: nanoId('id', tokenLength).primaryKey(),
  userId: varchar('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  issuedAt: timestamp('issued_at').defaultNow().notNull(),
});

export type TokenInsert = typeof tokens.$inferInsert;
export type Token = typeof tokens.$inferSelect;
