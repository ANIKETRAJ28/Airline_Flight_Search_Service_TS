import { Router } from 'express';

import { countryRouter } from './v1_routes/country.route';
import { cityRouter } from './v1_routes/city.route';

export const v1Router = Router();

v1Router.use('/countries', countryRouter);
v1Router.use('/cities', cityRouter);
