import { eventNotifier } from './features/notifications/worker';

dotenv.config();

import { logger } from './common/utils/logger';
import { app } from './app';
import dotenv from 'dotenv';

const notifier = eventNotifier();

const server = app.listen(process.env.PORT || 8080, () => {
  const { NODE_ENV, HOST, PORT } = process.env;

  notifier.start();
  logger.info(`Server in ${NODE_ENV} mode running on http://${HOST}:${PORT}`);
});


const onCloseSignal = async () => {
  logger.info('server closing...');

  server.close(() => {
    logger.info('server closed');
    process.exit();
  });
  
  notifier.stop();
  setTimeout(() => process.exit(1), 10000);
};

process.on('SIGINT', onCloseSignal);
process.on('SIGTERM', onCloseSignal);