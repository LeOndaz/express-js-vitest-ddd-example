import supertest from 'supertest';
import { app } from '../../../app';
import { EventInsert } from '@events/models/event';
import { expect } from 'chai';

const mockEvents: EventInsert[] = [
  { name: 'Event 1', date: '2023-08-01', category: 'concert', description: 'Test event', availableAttendeesCount: 20 },
  { name: 'Event 1', date: '2023-08-01', category: 'concert', description: 'Test event', availableAttendeesCount: 50 },
  { name: 'Event 1', date: '2023-08-01', category: 'concert', description: 'Test event', availableAttendeesCount: 60 },
];

describe('GET /events', () => {
  const request = supertest(app);
  
  describe('without filters', () => {
    it('should return a list of events with status 200', async () => {
      const response = await request.get('/events');
    
      expect(response.status).to.equal(200);
      expect(response.body).to.equal({ events: mockEvents });
    });
  });
});
