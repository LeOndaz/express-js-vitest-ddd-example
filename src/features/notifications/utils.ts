import { db } from '../../db';
import { notifications } from './models/notification';


interface NotifyOpts {
  content: string;
  eventId: string;
  userId: string;
}

export const notifyUser = async (notifyOpts: NotifyOpts) => {
  await db
    .insert(notifications)
    .values(notifyOpts)
    .returning()
    .execute();
};

export const notifyAboutReservation = async (userId: string, eventId: string) => {
  await notifyUser({
    userId,
    eventId,
    content: '~~ Your reservation ~~',
  });
};