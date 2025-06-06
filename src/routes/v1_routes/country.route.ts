import { Router } from 'express';

import { CountryController } from '../../controller/country.controller';
import { checkAdminRole, jwtMiddleware } from '../../middleware/auth.middleware';

export const countryRouter = Router();
const countryController = new CountryController();

countryRouter.get('/', jwtMiddleware, checkAdminRole, countryController.getAllCountries);
countryRouter.get('/:id', jwtMiddleware, checkAdminRole, countryController.getCountryById);
countryRouter.get('/name/:name', countryController.getCountryByName);
countryRouter.get('/code/:code', countryController.getCountryByCode);
countryRouter.post('/', jwtMiddleware, checkAdminRole, countryController.createCountry);
countryRouter.put('/name/:id', jwtMiddleware, checkAdminRole, countryController.updateCountryName);
countryRouter.put('/code/:id', jwtMiddleware, checkAdminRole, countryController.updateCountryCode);
countryRouter.delete('/:id', jwtMiddleware, checkAdminRole, countryController.deleteCountry);
