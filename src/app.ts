import express from 'express';
import { router } from './features';


const app = express();

app.use(express.json());

// app.use(errorHandler()); // TODO
// app.use(loggingMiddleware()); // TODO

app.use('', router);

app.get('', (req, res) => {
  res.send('Hello, world!');
});

export {
  app,
};