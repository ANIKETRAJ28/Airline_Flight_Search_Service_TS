import { Router } from 'express';
import { FlightAutomationController } from '../../controller/flight_automation.controller';

export const flightAutomationRouter = Router();
const flightAutomationController = new FlightAutomationController();

flightAutomationRouter.post('/', flightAutomationController.createFlightAutomation);
flightAutomationRouter.get('/', flightAutomationController.getAllFlightAutomations);
flightAutomationRouter.get('/active', flightAutomationController.getActiveFlightAutomations);
flightAutomationRouter.post('/create-flights', flightAutomationController.createFlightsFromAutomation);
