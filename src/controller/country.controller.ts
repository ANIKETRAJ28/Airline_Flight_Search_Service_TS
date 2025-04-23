import { Request, Response } from 'express';

import { CountryService } from '../service/country.service';
import { ICountry } from '../interface/countries.interface';

export class CountryController {
  private countryService: CountryService;

  constructor() {
    this.countryService = new CountryService();
  }

  getAllCountries = async (_req: Request, res: Response): Promise<void> => {
    try {
      const countries: ICountry[] = await this.countryService.getAllCountries();
      res.status(200).json(countries);
    } catch (error) {
      console.error('Error in CountryController: getAllCountries:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  getCountryById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ message: 'Country ID is required' });
        return;
      }
      const country: ICountry = await this.countryService.getCountryById(id);
      res.status(200).json(country);
    } catch (error) {
      console.error('Error in CountryController: getCountryById:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  getCountryByName = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name } = req.params;
      if (!name) {
        res.status(400).json({ message: 'Country name is required' });
        return;
      }
      const country: ICountry = await this.countryService.getCountryByName(name);
      res.status(200).json(country);
    } catch (error) {
      console.error('Error in CountryController: getCountryByName:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  getCountryByCode = async (req: Request, res: Response): Promise<void> => {
    try {
      const { code } = req.params;
      if (!code) {
        res.status(400).json({ message: 'Country code is required' });
        return;
      }
      const country: ICountry = await this.countryService.getCountryByCode(code);
      res.status(200).json(country);
    } catch (error) {
      console.error('Error in CountryController: getCountryByCode:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  createCountry = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, code } = req.body;
      if (!name || !code) {
        res.status(400).json({ message: 'Country name and code are required' });
        return;
      }
      const country: ICountry = await this.countryService.createCountry({ name, code });
      res.status(201).json(country);
    } catch (error) {
      console.error('Error in CountryController: createCountry:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  updateCountryName = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ message: 'Country ID is required' });
        return;
      }
      const { name } = req.body;
      if (!name) {
        res.status(400).json({ message: 'Country name is required' });
        return;
      }
      const updatedCountry: ICountry = await this.countryService.updateCountryName(id, name);
      res.status(200).json(updatedCountry);
    } catch (error) {
      console.log('Error in CountryController: updateCountryName:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  updateCountryCode = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ message: 'Country ID is required' });
        return;
      }
      const { code } = req.body;
      if (!code) {
        res.status(400).json({ message: 'Country code is required' });
        return;
      }
      const updatedCountry: ICountry = await this.countryService.updateCountryCode(id, code);
      res.status(200).json(updatedCountry);
    } catch (error) {
      console.log('Error in CountryController: updateCountryCode:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  deleteCountry = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ message: 'Country ID is required' });
        return;
      }
      await this.countryService.deleteCountry(id);
      res.status(204).send();
    } catch (error) {
      console.log('Error in CountryController: deleteCountry:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
}
