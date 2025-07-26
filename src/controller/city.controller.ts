import { Request, Response } from 'express';
import { CityService } from '../service/city.service';
import { apiHandler, errorHandler } from '../util/apiHandler.util';
import { ApiError } from '../util/api.util';

export class CityController {
  private cityService: CityService;

  constructor() {
    this.cityService = new CityService();
  }

  getCities = async (_req: Request, res: Response): Promise<void> => {
    try {
      const cities = await this.cityService.getCities();
      apiHandler(res, 200, 'All cities fetched successfully', cities);
    } catch (error) {
      errorHandler(error, res);
    }
  };

  getAllCities = async (req: Request, res: Response): Promise<void> => {
    try {
      const offset = parseInt(req.query.offset as string) || 0;
      const cities = await this.cityService.getAllCities(offset);
      apiHandler(res, 200, 'All cities fetched successfully', cities);
    } catch (error) {
      errorHandler(error, res);
    }
  };

  getCityById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new ApiError(400, 'City ID is required');
      }
      const city = await this.cityService.getCityById(id);
      apiHandler(res, 200, 'City fetched successfully', city);
    } catch (error) {
      errorHandler(error, res);
    }
  };

  getCitiesByName = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name } = req.query;
      if (!name || typeof name !== 'string') {
        throw new ApiError(400, 'City name is required');
      }
      const city = await this.cityService.getCitiesByName(name);
      apiHandler(res, 200, 'City fetched successfully', city);
    } catch (error) {
      errorHandler(error, res);
    }
  };

  getCitiesForCountry = async (req: Request, res: Response): Promise<void> => {
    try {
      const { countryId } = req.params;
      const offset = parseInt(req.query.offset as string) || 0;
      if (!countryId) {
        throw new ApiError(400, 'Country ID is required');
      }
      const cities = await this.cityService.getCitiesForCountry(countryId, offset);
      apiHandler(res, 200, 'Cities for country fetched successfully', cities);
    } catch (error) {
      errorHandler(error, res);
    }
  };

  searchCities = async (req: Request, res: Response): Promise<void> => {
    try {
      const { keyword, offset } = req.query;
      if (!keyword || typeof keyword !== 'string') {
        throw new ApiError(400, 'Search keyword is required');
      }
      const offsetValue = parseInt(offset as string) || 0;
      const city = await this.cityService.searchCities(keyword, offsetValue);
      apiHandler(res, 200, 'City fetched successfully', city);
    } catch (error) {
      errorHandler(error, res);
    }
  };

  createCity = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, country_id }: { name: string; country_id: string } = req.body;
      if (!name || !country_id) {
        throw new ApiError(400, 'City name and country ID are required');
      }
      const newCity = await this.cityService.createCity({ name, country_id });
      apiHandler(res, 201, 'City created successfully', newCity);
    } catch (error) {
      errorHandler(error, res);
    }
  };

  updateCityName = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      if (!id || !name) {
        throw new ApiError(400, 'City ID and name are required');
      }
      const updatedCity = await this.cityService.updateCityName(id, name);
      apiHandler(res, 200, 'City name updated successfully', updatedCity);
    } catch (error) {
      errorHandler(error, res);
    }
  };

  deleteCity = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new ApiError(400, 'City ID is required');
      }
      await this.cityService.deleteCity(id);
      apiHandler(res, 200, 'City deleted successfully');
    } catch (error) {
      errorHandler(error, res);
    }
  };
}
