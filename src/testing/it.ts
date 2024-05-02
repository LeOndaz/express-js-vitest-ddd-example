import { test } from 'vitest';
import { db } from '../db';
import { User } from '../features/auth/models/user';
import { Event, events } from '../features/events/models/event';
import { getAdminUserWithToken } from '../features/auth/auth.service';

interface Fixtures {
  auth: {
    user: User,
    token: string;
  },
  events: Event[],
  eventReservations: {
    reservations: []
  }
}

export const it = test.extend<Fixtures>({
  auth: async ({}, use) => {
    const { user, token } = await getAdminUserWithToken();

    await use({
      user,
      token: token.value,
    });
  },
  events: async ({}, use) => {
    const queryResult = await db.select().from(events);
    await use(queryResult);
  },
  reservations: async ({}, use) => {
    
  },
});