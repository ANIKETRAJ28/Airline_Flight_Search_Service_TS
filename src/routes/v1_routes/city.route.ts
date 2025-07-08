import { Router } from 'express';

import { CityController } from '../../controller/city.controller';
import { checkAdminRole, checkSuperAdminRole, jwtMiddleware } from '../../middleware/auth.middleware';

export const cityRouter = Router();
const cityController = new CityController();

cityRouter.get('/', jwtMiddleware, checkAdminRole, cityController.getAllCities);
cityRouter.get('/name', jwtMiddleware, cityController.searchCities);
cityRouter.get('/:id', jwtMiddleware, checkAdminRole, cityController.getCityById);
cityRouter.post('/', jwtMiddleware, checkSuperAdminRole, cityController.createCity);
cityRouter.put('/:id', jwtMiddleware, checkSuperAdminRole, cityController.updateCityName);
cityRouter.delete('/:id', jwtMiddleware, checkSuperAdminRole, cityController.deleteCity);
