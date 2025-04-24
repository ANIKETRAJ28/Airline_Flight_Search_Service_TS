import { Router } from 'express';

import { AirplaneController } from '../../controller/airplane.controller';

export const airplaneRouter = Router();
const airplaneController = new AirplaneController();

airplaneRouter.get('/', airplaneController.getAllAirplanes);
airplaneRouter.get('/:id', airplaneController.getAirplaneById);
airplaneRouter.get('/name/:name', airplaneController.getAirplaneByName);
airplaneRouter.get('/code/:code', airplaneController.getAirplaneByCode);
airplaneRouter.post('/', airplaneController.createAirplane);
airplaneRouter.put('/name/:id', airplaneController.updateAirplaneName);
airplaneRouter.put('/code/:id', airplaneController.updateAirplaneCode);
airplaneRouter.put('/capacity/:id', airplaneController.updateAirplaneCapacity);
airplaneRouter.delete('/:id', airplaneController.deleteAirplane);
