import supertest from 'supertest';
import { app } from '../../../../app';
import { Event } from '../../models/event';
import { describe, expect } from 'vitest';
import { it } from '../../../../testing/it';

describe('GET /events', () => {
  const request = supertest(app);

  describe('without filters', () => {
    it('should return a list of events with status 200', async ({ auth: { token }, events }) => {
      const response = await request.get('/events').set('Authorization', `Bearer ${token}`);

      expect(response.status).to.equal(200);
      const responseEvents: Event[] = response.body.events;
      
      expect(responseEvents.length).toEqual(events.length);
      expect(new Set(responseEvents)).toEqual(new Set(events));

      responseEvents.forEach((item: Event) => {
        expect(item).toHaveProperty('id');
      });
    });
  });
  
  describe('with filters', () => {
    it('should return a list of events with status 200', async () => {
      // TODO implement
    }); 
  });
});
