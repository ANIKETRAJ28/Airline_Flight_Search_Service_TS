import { Router } from 'express';

import { AirportController } from '../../controller/airport.controller';
import { checkAdminRole, checkSuperAdminRole, jwtMiddleware } from '../../middleware/auth.middleware';

export const airportRouter = Router();
const airportController = new AirportController();

airportRouter.get('/', jwtMiddleware, checkAdminRole, airportController.getAllAirports);
airportRouter.get('/list', jwtMiddleware, checkAdminRole, airportController.getAirports);
airportRouter.get('/search', jwtMiddleware, checkAdminRole, airportController.searchAirports);
airportRouter.get('/country/:countryId', jwtMiddleware, checkAdminRole, airportController.getAirportsForCountry);
airportRouter.get('/city/:id', jwtMiddleware, checkAdminRole, airportController.getAllAirportsOfCityByCityId);
airportRouter.get('/id/:id', jwtMiddleware, checkAdminRole, airportController.getAirportById);
airportRouter.get('/code/:code', jwtMiddleware, checkAdminRole, airportController.getAirportByCode);
airportRouter.get('/city/name/:name', jwtMiddleware, checkAdminRole, airportController.getAllAirportsOfCityByCityName);
airportRouter.post('/', jwtMiddleware, checkSuperAdminRole, airportController.createAirport);
airportRouter.put('/name/:id', jwtMiddleware, checkSuperAdminRole, airportController.updateAirportName);
airportRouter.put('/code/:id', jwtMiddleware, checkSuperAdminRole, airportController.updateAirportCode);
airportRouter.delete('/:id', jwtMiddleware, checkSuperAdminRole, airportController.deleteAirport);
