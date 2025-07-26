import { Router } from 'express';

import { countryRouter } from './v1_routes/country.route';
import { cityRouter } from './v1_routes/city.route';
import { airplaneRouter } from './v1_routes/airplane.route';
import { airportRouter } from './v1_routes/airport.route';
import { flightRouter } from './v1_routes/flight.route';
import { flightAutomationRouter } from './v1_routes/flight_automation.route';

export const v1Router = Router();

v1Router.use('/countries', countryRouter);
v1Router.use('/cities', cityRouter);
v1Router.use('/airplanes', airplaneRouter);
v1Router.use('/airports', airportRouter);
v1Router.use('/flight', flightRouter);
v1Router.use('/flight_automation', flightAutomationRouter);
