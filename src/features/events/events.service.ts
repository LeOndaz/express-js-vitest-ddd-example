import { CreateEventSchema, eventAttendeesMax, ListEventSchema, ReserveTicketSchema } from '@events/event.validation';
import { db } from '@db/db';
import { Event, events } from '@events/models/event';
import { and, between, eq, gte, lte } from 'drizzle-orm';
import { Reservation, reservations } from '@events/models/reservation';

interface ReserveTicketOpts {
  userId: string;
  eventId: string;
  data: ReserveTicketSchema;
}
// TODO pagination is not implemented
export const getEvents = async (filters: ListEventSchema) => {
  // TODO can be better

  const whereConditions = [];

  let dateCondition;

  if (filters.startDate && filters.endDate) {
    dateCondition = between(events.date, filters.startDate, filters.endDate);
  } else if (filters.startDate) {
    dateCondition = gte(events.date, filters.startDate);
  } else if (filters.endDate) {
    dateCondition = lte(events.date, filters.endDate);
  }

  whereConditions.push(dateCondition);

  if (filters.name) {
    whereConditions.push(eq(events.name, filters.name));
  }

  if (filters.category) {
    whereConditions.push(eq(events.category, filters.category));
  }

  // TODO: I think drizzle does not support single object response, e.g (no .single() or .one())
  const where = whereConditions.length > 1 ? and(...whereConditions) : whereConditions[0];

  return db
    .select({
      id: events.id,
      name: events.name,
      date: events.date,
      availableAttendeesCount: events.availableAttendeesCount,
      description: events.description,
      category: events.category,
    })
    .from(events)
    .where(where)
    .execute();
};

export const createEvent = async (data: CreateEventSchema): Promise<Event> => {
  const [event] = await db
    .insert(events)
    .values(data)
    .returning()
    .execute();

  return event;
};

export const reserveTicket = async (opts: ReserveTicketOpts): Promise<Reservation> => {
  const { data, userId, eventId } = opts;
  
  const reservation = await getReservation(userId, eventId);
  
  if (reservation) {
    if (reservation.attendeesCount === eventAttendeesMax) {
      throw new Error(`an event has a maximum of ${eventAttendeesMax} attendees`);
    }
    
    if (reservation.attendeesCount + data.attendeesCount > eventAttendeesMax) {
      throw new Error(`only ${eventAttendeesMax - reservation.attendeesCount} seats are left`);
    }
  }

  const results = await db
    .insert(reservations)
    .values({
      eventId,
      userId,
      ...data,
    })
    .returning()
    .execute();
  
  return results[0];
};

export const getReservation = async (userId:string, eventId: string): Promise<Reservation | null> => {
  const [ reservation ] = await db
    .select({
      id: reservations.id,
      eventId: reservations.eventId,
      reservedAt: reservations.reservedAt,
      userId: reservations.userId,
      attendeesCount: reservations.attendeesCount,
    })
    .from(reservations)
    .where(
      and(
        eq(reservations.userId, userId),
        eq(reservations.eventId, eventId),
      ),
    )
    .execute();
  
  return reservation;
};