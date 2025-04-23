import { Router } from 'express';

import { CountryController } from '../../controller/country.controller';

export const countryRouter = Router();
const countryController = new CountryController();

countryRouter.get('/', countryController.getAllCountries);
countryRouter.get('/:id', countryController.getCountryById);
countryRouter.get('/name/:name', countryController.getCountryByName);
countryRouter.get('/code/:code', countryController.getCountryByCode);
countryRouter.post('/', countryController.createCountry);
countryRouter.put('/name/:id', countryController.updateCountryName);
countryRouter.put('/code/:id', countryController.updateCountryCode);
countryRouter.delete('/:id', countryController.deleteCountry);
