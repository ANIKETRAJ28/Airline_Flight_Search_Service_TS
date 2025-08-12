import { Router } from 'express';
import { FlightAutomationController } from '../../controller/flight_automation.controller';

export const flightAutomationRouter = Router();
const flightAutomationController = new FlightAutomationController();

flightAutomationRouter.post('/', flightAutomationController.createFlightAutomation);
flightAutomationRouter.post('/create-flights', flightAutomationController.createFlightsFromAutomation);
flightAutomationRouter.get('/', flightAutomationController.getAllFlightAutomations);
flightAutomationRouter.get('/active', flightAutomationController.getActiveFlightAutomations);
flightAutomationRouter.get('/date', flightAutomationController.getFlightAutomationsByDate);
flightAutomationRouter.get('/cancelled', flightAutomationController.getFlightAutomationsByCancelledStatus);
flightAutomationRouter.get('/:id', flightAutomationController.getFlightAutomationById);
flightAutomationRouter.put('/:id', flightAutomationController.updateFlightAutomationById);
