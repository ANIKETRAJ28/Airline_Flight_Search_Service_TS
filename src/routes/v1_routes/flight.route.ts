import { Router } from 'express';

import { FlightController } from '../../controller/flight.controller';
import { checkSuperAdminRole, jwtMiddleware } from '../../middleware/auth.middleware';

export const flightRouter = Router();
const flightController = new FlightController();

flightRouter.post('/', jwtMiddleware, checkSuperAdminRole, flightController.createFlight);
flightRouter.get('/', jwtMiddleware, checkSuperAdminRole, flightController.getAllFlights);
flightRouter.get('/flight_id/:id', jwtMiddleware, flightController.getFlighByIdForUser);
flightRouter.get(
  '/departure_city/:departure_city_id/arrival_city/:arrival_city_id/date/:date',
  jwtMiddleware,
  flightController.getFlightsForArrivalAndDepartureCity,
);
flightRouter.get('/flight_number/:flight_number', jwtMiddleware, flightController.getFlightByFlightNumber);
flightRouter.get(
  '/departure_airport/:departure_airport_id',
  jwtMiddleware,
  checkSuperAdminRole,
  flightController.getFlightsByDepartureAirport,
);
flightRouter.get(
  '/arrival_airport/:arrival_airport_id',
  jwtMiddleware,
  checkSuperAdminRole,
  flightController.getFlightsByArrivalAirport,
);
flightRouter.get('/status', jwtMiddleware, flightController.getFlightByStatus);
flightRouter.get('/date', jwtMiddleware, checkSuperAdminRole, flightController.getFlightsByDate);
flightRouter.get('/:id', flightController.getFlightByIdForAdmin);
flightRouter.put('/:id/arrival_time', jwtMiddleware, checkSuperAdminRole, flightController.updateFlightArrivalTime);
flightRouter.put('/:id/departure_time', jwtMiddleware, checkSuperAdminRole, flightController.updateFlightDepartureTime);
flightRouter.put('/:id/price', jwtMiddleware, checkSuperAdminRole, flightController.updateFlightPrice);
flightRouter.put('/:id/status', jwtMiddleware, checkSuperAdminRole, flightController.updateFlightStatus);
flightRouter.put('/:id/seat', flightController.updateFlightWindowSeats);
flightRouter.put(
  '/:id/arrival_airport',
  jwtMiddleware,
  checkSuperAdminRole,
  flightController.updateFlightArrivalAirport,
);
flightRouter.put(
  '/:id/departure_airport',
  jwtMiddleware,
  checkSuperAdminRole,
  flightController.updateFlightDepartureAirport,
);
flightRouter.delete('/:id', jwtMiddleware, checkSuperAdminRole, flightController.deleteFlight);
