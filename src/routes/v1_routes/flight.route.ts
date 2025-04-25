import { Router } from 'express';

import { FlightController } from '../../controller/flight.controller';

export const flightRouter = Router();
const flightController = new FlightController();

flightRouter.post('/', flightController.createFlight);
flightRouter.get('/', flightController.getAllFlights);
flightRouter.get('/:id', flightController.getFlightWithDetailById);
flightRouter.get('/flight_number/:flight_number', flightController.getFlightByFlightNumber);
flightRouter.put('/:id/arrival_time', flightController.updateFlightArrivalTime);
flightRouter.put('/:id/departure_time', flightController.updateFlightDepartureTime);
flightRouter.put('/:id/price', flightController.updateFlightPrice);
flightRouter.put('/:id/status', flightController.updateFlightStatus);
flightRouter.put('/:id/arrival_airport', flightController.updateFlightArrivalAirport);
flightRouter.put('/:id/departure_airport', flightController.updateFlightDepartureAirport);
flightRouter.delete('/:id', flightController.deleteFlight);
