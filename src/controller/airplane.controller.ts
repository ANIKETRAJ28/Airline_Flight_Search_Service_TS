import { Request, Response } from 'express';

import { AirplaneService } from '../service/airplane.service';
import { apiHandler, errorHandler } from '../util/apiHandler.util';
import { ApiError } from '../util/api.util';

export class AirplaneController {
  private airplaneService: AirplaneService;

  constructor() {
    this.airplaneService = new AirplaneService();
  }

  getAllAirplanes = async (_req: Request, res: Response): Promise<void> => {
    try {
      const airplanes = await this.airplaneService.getAllAirplanes();
      apiHandler(res, 200, 'All airplanes fetched successfully', airplanes);
    } catch (error) {
      errorHandler(error, res);
    }
  };

  getAirplaneById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new ApiError(400, 'Airplane ID is required');
      }
      const airplane = await this.airplaneService.getAirplaneById(id);
      apiHandler(res, 200, 'Airplane fetched successfully', airplane);
    } catch (error) {
      errorHandler(error, res);
    }
  };

  getAirplaneByCode = async (req: Request, res: Response): Promise<void> => {
    try {
      const { code } = req.params;
      if (!code) {
        throw new ApiError(400, 'Airplane code is required');
      }
      const airplane = await this.airplaneService.getAirplaneByCode(code);
      apiHandler(res, 200, 'Airplane fetched successfully', airplane);
    } catch (error) {
      errorHandler(error, res);
    }
  };

  getAirplaneByName = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name } = req.params;
      if (!name) {
        throw new ApiError(400, 'Airplane name is required');
      }
      const airplane = await this.airplaneService.getAirplaneByName(name);
      apiHandler(res, 200, 'Airplane fetched successfully', airplane);
    } catch (error) {
      errorHandler(error, res);
    }
  };

  createAirplane = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, code, capacity }: { name: string; code: string; capacity: number } = req.body;
      if (!name || !code || !capacity) {
        throw new ApiError(400, 'Airplane name, code, and capacity are required');
      }
      const newAirplane = await this.airplaneService.createAirplane({ name, code, capacity });
      apiHandler(res, 201, 'Airplane created successfully', newAirplane);
    } catch (error) {
      errorHandler(error, res);
    }
  };

  updateAirplaneName = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      if (!id || !name) {
        throw new ApiError(400, 'Airplane ID and name are required');
      }
      const updatedAirplane = await this.airplaneService.updateAirplaneName(id, name);
      apiHandler(res, 200, 'Airplane name updated successfully', updatedAirplane);
    } catch (error) {
      errorHandler(error, res);
    }
  };

  updateAirplaneCode = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { code } = req.body;
      if (!id || !code) {
        throw new ApiError(400, 'Airplane ID and code are required');
      }
      const updatedAirplane = await this.airplaneService.updateAirplaneCode(id, code);
      apiHandler(res, 200, 'Airplane code updated successfully', updatedAirplane);
    } catch (error) {
      errorHandler(error, res);
    }
  };

  updateAirplaneCapacity = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { capacity } = req.body;
      if (!id || !capacity) {
        throw new ApiError(400, 'Airplane ID and capacity are required');
      }
      const updatedAirplane = await this.airplaneService.updateAirplaneCapacity(id, capacity);
      apiHandler(res, 200, 'Airplane capacity updated successfully', updatedAirplane);
    } catch (error) {
      errorHandler(error, res);
    }
  };

  deleteAirplane = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new ApiError(400, 'Airplane ID is required');
      }
      await this.airplaneService.deleteAirplane(id);
      apiHandler(res, 200, 'Airplane deleted successfully');
    } catch (error) {
      errorHandler(error, res);
    }
  };
}
