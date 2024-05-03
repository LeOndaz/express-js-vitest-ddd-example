import { faker } from '@faker-js/faker';
import { EventInsert } from '../../features/events/models/event';
// import { ReservationInsert } from '../../features/events/models/reservation';

export const events: EventInsert[] = Array(50).map(() => ({
  name: faker.lorem.word(),
  description: faker.lorem.text(),
  category: faker.helpers.arrayElement(['concert', 'conference', 'game']),
  availableAttendeesCount: faker.helpers.rangeToNumber({ min: 1, max: 1000 }),
  date: faker.date.anytime().toDateString(),
}));

// export const reservations: ReservationInsert[] = Array(100).map(() => ({}));