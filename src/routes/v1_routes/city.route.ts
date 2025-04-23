import { Router } from 'express';

import { CityController } from '../../controller/city.controller';

export const cityRouter = Router();
const cityController = new CityController();

cityRouter.get('/', cityController.getAllCities);
cityRouter.get('/:id', cityController.getCityById);
cityRouter.get('/name/:name', cityController.getCityByName);
cityRouter.post('/', cityController.createCity);
cityRouter.put('/:id', cityController.updateCityName);
cityRouter.delete('/:id', cityController.deleteCity);
