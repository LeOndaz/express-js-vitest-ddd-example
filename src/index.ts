dotenv.config();

import { logger } from '@common/utils/logger';
import { app } from './app';
import dotenv from 'dotenv';


const server = app.listen(process.env.PORT || 8080, () => {
  const { NODE_ENV, HOST, PORT } = process.env;

  logger.info(`Server in ${NODE_ENV} mode running on http://${HOST}:${PORT}`);
});

const onCloseSignal = () => {
  logger.info('server closing...');

  server.close(() => {
    logger.info('server closed');
    process.exit();
  });
  
  setTimeout(() => process.exit(1), 10000);
};

process.on('SIGINT', onCloseSignal);
process.on('SIGTERM', onCloseSignal);