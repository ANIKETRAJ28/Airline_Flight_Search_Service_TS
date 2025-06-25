import { Request, Response } from 'express';

import { AirportService } from '../service/airport.service';
import { apiHandler, errorHandler } from '../util/apiHandler.util';
import { ApiError } from '../util/api.util';

export class AirportController {
  private airportService: AirportService;

  constructor() {
    this.airportService = new AirportService();
  }

  getAllAirports = async (_req: Request, res: Response): Promise<void> => {
    try {
      const airports = await this.airportService.getAllAirports();
      apiHandler(res, 200, 'All airports fetched successfully', airports);
    } catch (error) {
      errorHandler(error, res);
    }
  };

  getAirportById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new ApiError(400, 'Airport ID is required');
      }
      const airport = await this.airportService.getAirportById(id);
      apiHandler(res, 200, 'Airport fetched successfully', airport);
    } catch (error) {
      errorHandler(error, res);
    }
  };

  getAirportByCode = async (req: Request, res: Response): Promise<void> => {
    try {
      const { code } = req.params;
      if (!code) {
        throw new ApiError(400, 'Airport code is required');
      }
      const airport = await this.airportService.getAirportByCode(code);
      apiHandler(res, 200, 'Airport fetched successfully', airport);
    } catch (error) {
      errorHandler(error, res);
    }
  };

  getAllAirportsOfCityByCityId = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new ApiError(400, 'City ID is required');
      }
      const airports = await this.airportService.getAllAirportsOfCityByCityId(id);
      apiHandler(res, 200, 'Airports of city fetched successfully', airports);
    } catch (error) {
      errorHandler(error, res);
    }
  };

  getAllAirportsOfCityByCityName = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name } = req.params;
      if (!name) {
        throw new ApiError(400, 'City name is required');
      }
      const airports = await this.airportService.getAllAirportsOfCityByCityName(name);
      apiHandler(res, 200, 'Airports of city fetched successfully', airports);
    } catch (error) {
      errorHandler(error, res);
    }
  };

  createAirport = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, code, city_id }: { name: string; code: string; city_id: string } = req.body;
      if (!name || !code || !city_id) {
        throw new ApiError(400, 'Airport name, code, and city ID are required');
      }
      const newAirport = await this.airportService.createAirport({
        name,
        code,
        city_id,
      });
      apiHandler(res, 201, 'Airport created successfully', newAirport);
    } catch (error) {
      errorHandler(error, res);
    }
  };

  updateAirportName = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      if (!id || !name) {
        throw new ApiError(400, 'Airport ID and name are required');
      }
      const updatedAirport = await this.airportService.updateAirportName(id, name);
      apiHandler(res, 200, 'Airport name updated successfully', updatedAirport);
    } catch (error) {
      errorHandler(error, res);
    }
  };

  updateAirportCode = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { code } = req.body;
      if (!id || !code) {
        throw new ApiError(400, 'Airport ID and code are required');
      }
      const updatedAirport = await this.airportService.updateAirportCode(id, code);
      apiHandler(res, 200, 'Airport code updated successfully', updatedAirport);
    } catch (error) {
      errorHandler(error, res);
    }
  };

  deleteAirport = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new ApiError(400, 'Airport ID is required');
      }
      await this.airportService.deleteAirport(id);
      apiHandler(res, 200, 'Airport deleted successfully');
    } catch (error) {
      errorHandler(error, res);
    }
  };
}
