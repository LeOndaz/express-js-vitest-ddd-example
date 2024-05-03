import {CreateEventDto, eventAttendeesMax, ListEventDto, ReserveTicketDto} from './/event.validation';
import { db } from './../../db';
import {Event, events} from './models/event';
import {and, between, eq, gte, lte, sum} from 'drizzle-orm';
import {Reservation, reservations} from './models/reservation';
import {User} from '../auth/models/user';

interface ReserveTicketOpts {
  userId: string;
  eventId: string;
  data: ReserveTicketDto;
}

// TODO pagination is not implemented
export const getEvents = async (filters: ListEventDto) => {
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

export const createEvent = async (data: CreateEventDto): Promise<Event> => {
  const [event] = await db
    .insert(events)
    .values(data)
    .returning()
    .execute();

  return event;
};

export const reserveTicket = async (opts: ReserveTicketOpts): Promise<Reservation> => {
  const {data, userId, eventId} = opts;

  const existingReservation = await getReservation(userId, eventId);

  if (existingReservation) {
    throw new Error(`user with id=${userId} already reserved event with id=${eventId}`);
  }

  const [{totalAttendees}] = await db
    .select({
      totalAttendees: sum(reservations.attendeesCount).mapWith(parseInt),
    })
    .from(reservations)
    .where(
      eq(reservations.eventId, opts.eventId),
    )
    .execute();


  if (data.attendeesCount + totalAttendees >= eventAttendeesMax) {
    throw new Error(`only ${totalAttendees - data.attendeesCount} seats are left`);
  }

  const [reservation] = await db
    .insert(reservations)
    .values({
      eventId,
      userId,
      ...data,
    })
    .returning()
    .execute();

  return reservation;
};

export const getReservation = async (userId: string, eventId: string): Promise<Reservation | null> => {
  const [reservation] = await db
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

export const cancelReservation = async (user: User, eventId: string) => {
  return db
    .delete(reservations)
    .where(
      and(
        eq(reservations.userId, user.id),
        eq(reservations.eventId, eventId),
      ),
    )
    .returning()
    .execute();
};
