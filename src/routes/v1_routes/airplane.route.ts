import { Router } from 'express';

import { AirplaneController } from '../../controller/airplane.controller';
import { checkAdminRole, checkSuperAdminRole, jwtMiddleware } from '../../middleware/auth.middleware';

export const airplaneRouter = Router();
const airplaneController = new AirplaneController();

airplaneRouter.get('/', jwtMiddleware, checkAdminRole, airplaneController.getAllAirplanes);
airplaneRouter.get('/:id', airplaneController.getAirplaneById); // internal use
airplaneRouter.get('/name/:name', jwtMiddleware, checkAdminRole, airplaneController.getAirplaneByName);
airplaneRouter.get('/code/:code', jwtMiddleware, checkAdminRole, airplaneController.getAirplaneByCode);
airplaneRouter.post('/', jwtMiddleware, checkSuperAdminRole, airplaneController.createAirplane);
airplaneRouter.put('/name/:id', jwtMiddleware, checkSuperAdminRole, airplaneController.updateAirplaneName);
airplaneRouter.put('/code/:id', jwtMiddleware, checkSuperAdminRole, airplaneController.updateAirplaneCode);
airplaneRouter.put('/capacity/:id', airplaneController.updateAirplaneCapacity); // internal use
airplaneRouter.delete('/:id', jwtMiddleware, checkSuperAdminRole, airplaneController.deleteAirplane);
