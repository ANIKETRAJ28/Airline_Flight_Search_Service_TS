import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { PORT } from './config/env.config';
import { corsOptions } from './util/cors.util';
import { v1Router } from './routes/index.route';

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/v1', v1Router);

app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({ message: 'Server is alive' });
  return;
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
