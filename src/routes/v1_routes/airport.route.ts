import { Router } from 'express';

import { AirportController } from '../../controller/airport.controller';

export const airportRouter = Router();
const airportController = new AirportController();

airportRouter.get('/', airportController.getAllAirports);
airportRouter.get('/id/:id', airportController.getAirportById);
airportRouter.get('/code/:code', airportController.getAirportByCode);
airportRouter.get('/city/id/:id', airportController.getAllAirportsOfCityByCityId);
airportRouter.get('/city/name/:name', airportController.getAllAirportsOfCityByCityName);
airportRouter.post('/', airportController.createAirport);
airportRouter.put('/name/:id', airportController.updateAirportName);
airportRouter.put('/code/:id', airportController.updateAirportCode);
airportRouter.delete('/:id', airportController.deleteAirport);
