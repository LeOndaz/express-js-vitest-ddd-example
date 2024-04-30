import { db } from '../src/db/db';
import { EventInsert, events } from '../src/features/events/models/event';

exports.mochaHooks = {
  beforeAll() {
    const mockEvents: EventInsert[] = [
      { name: 'Event 1', date: '2023-08-01', category: 'concert', description: 'Test event', availableAttendeesCount: 20 },
      { name: 'Event 1', date: '2023-08-01', category: 'concert', description: 'Test event', availableAttendeesCount: 50 },
      { name: 'Event 1', date: '2023-08-01', category: 'concert', description: 'Test event', availableAttendeesCount: 60 },
    ];

    return (
      db
        .insert(events)
        .values(mockEvents)
        .execute()
    );
  },
};
