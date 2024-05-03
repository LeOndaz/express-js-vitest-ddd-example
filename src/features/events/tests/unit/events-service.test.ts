
import { describe, expect } from 'vitest';
import { it } from '../../../../testing/it';
import { getEvents } from '../../events.service';

describe('events service', () => {
  it('should return list of events', async ({ events }) => {
    const result = await getEvents({}); // TODO: should test filters as well
    expect(result).toMatchObject(events);
  });
});