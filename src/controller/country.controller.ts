import { Request, Response } from 'express';
import { CountryService } from '../service/country.service';
import { ICountry } from '../interface/countries.interface';
import { apiHandler, errorHandler } from '../util/apiHandler.util';
import { ApiError } from '../util/api.util';

export class CountryController {
  private countryService: CountryService;

  constructor() {
    this.countryService = new CountryService();
  }

  getCountries = async (req: Request, res: Response): Promise<void> => {
    try {
      const countries: ICountry[] = await this.countryService.getCountries();
      apiHandler(res, 200, 'All countries fetched successfully', countries);
    } catch (error) {
      errorHandler(error, res);
    }
  };

  getAllCountries = async (req: Request, res: Response): Promise<void> => {
    try {
      const offset = parseInt(req.query.offset as string) || 0;
      const countries: ICountry[] = await this.countryService.getAllCountries(offset);
      apiHandler(res, 200, 'All countries fetched successfully', countries);
    } catch (error) {
      errorHandler(error, res);
    }
  };

  getCountryById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new ApiError(400, 'Country ID is required');
      }
      const country: ICountry = await this.countryService.getCountryById(id);
      apiHandler(res, 200, 'Country fetched successfully', country);
    } catch (error) {
      errorHandler(error, res);
    }
  };

  searchCountry = async (req: Request, res: Response): Promise<void> => {
    try {
      const { keyword, offset } = req.query;
      if (!keyword || typeof keyword !== 'string') {
        throw new ApiError(400, 'Search keyword is required');
      }
      const offsetValue = parseInt(offset as string) || 0;
      const countries: ICountry[] = await this.countryService.searchCountry(keyword, offsetValue);
      apiHandler(res, 200, 'Countries fetched successfully', countries);
    } catch (error) {
      errorHandler(error, res);
    }
  };

  getCountryByName = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name } = req.params;
      if (!name) {
        throw new ApiError(400, 'Country name is required');
      }
      const country: ICountry = await this.countryService.getCountryByName(name);
      apiHandler(res, 200, 'Country fetched successfully', country);
    } catch (error) {
      errorHandler(error, res);
    }
  };

  getCountryByCode = async (req: Request, res: Response): Promise<void> => {
    try {
      const { code } = req.params;
      if (!code) {
        throw new ApiError(400, 'Country code is required');
      }
      const country: ICountry = await this.countryService.getCountryByCode(code);
      apiHandler(res, 200, 'Country fetched successfully', country);
    } catch (error) {
      errorHandler(error, res);
    }
  };

  createCountry = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, code } = req.body;
      if (!name || !code) {
        throw new ApiError(400, 'Country name and code are required');
      }
      const country: ICountry = await this.countryService.createCountry({ name, code });
      apiHandler(res, 201, 'Country created successfully', country);
    } catch (error) {
      errorHandler(error, res);
    }
  };

  updateCountryName = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new ApiError(400, 'Country ID is required');
      }
      const { name } = req.body;
      if (!name) {
        throw new ApiError(400, 'Country name is required');
      }
      const updatedCountry: ICountry = await this.countryService.updateCountryName(id, name);
      apiHandler(res, 200, 'Country name updated successfully', updatedCountry);
    } catch (error) {
      errorHandler(error, res);
    }
  };

  updateCountryCode = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new ApiError(400, 'Country ID is required');
      }
      const { code } = req.body;
      if (!code) {
        throw new ApiError(400, 'Country code is required');
      }
      const updatedCountry: ICountry = await this.countryService.updateCountryCode(id, code);
      apiHandler(res, 200, 'Country code updated successfully', updatedCountry);
    } catch (error) {
      errorHandler(error, res);
    }
  };

  deleteCountry = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new ApiError(400, 'Country ID is required');
      }
      await this.countryService.deleteCountry(id);
      apiHandler(res, 200, 'Country deleted successfully');
    } catch (error) {
      errorHandler(error, res);
    }
  };
}
