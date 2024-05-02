import cron from 'node-cron';
import { sendEventNotifications } from './notifications.service';


export const eventNotifier = () => {
  return cron.schedule('* * * * * *', async () => {
    await sendEventNotifications();
  });
};