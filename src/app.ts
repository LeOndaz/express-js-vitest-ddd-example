import express from 'express';
import { router } from './features';
import { setupAdminUser } from './features/auth/auth.service';
import { errorHandler } from './common/middleware/errorHandler';

const app = express();

app.use(express.json());
app.use('/', router);
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.use(errorHandler);

await setupAdminUser();

export {
  app,
};