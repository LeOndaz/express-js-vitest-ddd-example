import { index, pgTable, varchar } from 'drizzle-orm/pg-core';
import { nanoId } from '../../../db/fields/nanoId';

export const users = pgTable('users', {
  id: nanoId('id').primaryKey(),

  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password: varchar('password', { length: 255 }), // TODO: users can have no passwords
}, (table) => {
  return {
    emailIndex: index('email_idx').on(table.email),
  };
});

export type UserInsert = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
