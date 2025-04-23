import { Request, Response } from 'express';
import { CityService } from '../service/city.service';

export class CityController {
  private cityService: CityService;

  constructor() {
    this.cityService = new CityService();
  }

  getAllCities = async (_req: Request, res: Response): Promise<void> => {
    try {
      const cities = await this.cityService.getAllCities();
      res.status(200).json(cities);
    } catch (error) {
      console.error('Error in CityController: getAllCities:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  getCityById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ message: 'City ID is required' });
        return;
      }
      const city = await this.cityService.getCityById(id);
      res.status(200).json(city);
    } catch (error) {
      console.error('Error in CityController: getCityById:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  getCityByName = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name } = req.params;
      if (!name) {
        res.status(400).json({ message: 'City name is required' });
        return;
      }
      const city = await this.cityService.getCityByName(name);
      res.status(200).json(city);
    } catch (error) {
      console.error('Error in CityController: getCityByName:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  createCity = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, country_id }: { name: string; country_id: string } = req.body;
      if (!name || !country_id) {
        res.status(400).json({ message: 'City data is required' });
        return;
      }
      const newCity = await this.cityService.createCity({ name, country_id });
      res.status(201).json(newCity);
    } catch (error) {
      console.error('Error in CityController: createCity:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  updateCityName = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      if (!id || !name) {
        res.status(400).json({ message: 'City ID and name are required' });
        return;
      }
      const updatedCity = await this.cityService.updateCityName(id, name);
      res.status(200).json(updatedCity);
    } catch (error) {
      console.error('Error in CityController: updateCityName:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  deleteCity = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ message: 'City ID is required' });
        return;
      }
      await this.cityService.deleteCity(id);
      res.status(204).send();
    } catch (error) {
      console.error('Error in CityController: deleteCity:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
}
