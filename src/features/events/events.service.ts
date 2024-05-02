import { CreateEventSchema, eventAttendeesMax, ListEventSchema, ReserveTicketSchema } from './/event.validation';
import { db } from './../../db';
import { Event, events } from './models/event';
import { and, between, eq, gte, lte } from 'drizzle-orm';
import { Reservation, reservations } from './models/reservation';
import { users } from '../auth/models/user';

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
  
  if (dateCondition) {
    whereConditions.push(dateCondition);
  }

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

export const getBookedEvents = async (userId: string) => {
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
    .leftJoin(reservations, eq(events.id, reservations.eventId))
    .where(
      eq(reservations.userId, userId),
    )
    .execute();
};

export const cancelReservation = async (reservationId: string) => {
  return db
    .delete(reservations)
    .where(eq(reservations.id, reservationId))
    .returning()
    .execute();
};

export const getReservations = async () => {
  return db.
    select(/* TODO should have the field explicitly */)
    .from(reservations)
    .innerJoin(events, eq(reservations.eventId, events.id))
    .innerJoin(users, eq(reservations.userId, users.id))
    .execute();
};
