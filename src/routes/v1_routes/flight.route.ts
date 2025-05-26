import { Router } from 'express';

import { FlightController } from '../../controller/flight.controller';
import { checkSuperAdminRole, jwtMiddleware } from '../../middleware/auth.middleware';

export const flightRouter = Router();
const flightController = new FlightController();

flightRouter.post('/', jwtMiddleware, checkSuperAdminRole, flightController.createFlight);
flightRouter.get('/', jwtMiddleware, checkSuperAdminRole, flightController.getAllFlights);
flightRouter.get('/:id', jwtMiddleware, flightController.getFlightWithDetailById);
flightRouter.get('/flight_number/:flight_number', jwtMiddleware, flightController.getFlightByFlightNumber);
flightRouter.put('/:id/arrival_time', jwtMiddleware, checkSuperAdminRole, flightController.updateFlightArrivalTime);
flightRouter.put('/:id/departure_time', jwtMiddleware, checkSuperAdminRole, flightController.updateFlightDepartureTime);
flightRouter.put('/:id/price', jwtMiddleware, checkSuperAdminRole, flightController.updateFlightPrice);
flightRouter.put('/:id/status', jwtMiddleware, checkSuperAdminRole, flightController.updateFlightStatus);
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
