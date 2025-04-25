import { Request, Response } from 'express';

import { AirportService } from '../service/airport.service';

export class AirportController {
  private airportService: AirportService;

  constructor() {
    this.airportService = new AirportService();
  }

  getAllAirports = async (_req: Request, res: Response): Promise<void> => {
    try {
      const airports = await this.airportService.getAllAirports();
      res.status(200).json(airports);
    } catch (error) {
      console.error('Error in AirportController: getAllAirports:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  getAirportById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ message: 'Airport ID is required' });
        return;
      }
      const airport = await this.airportService.getAirportById(id);
      res.status(200).json(airport);
    } catch (error) {
      console.error('Error in AirportController: getAirportById:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  getAirportByCode = async (req: Request, res: Response): Promise<void> => {
    try {
      const { code } = req.params;
      if (!code) {
        res.status(400).json({ message: 'Airport code is required' });
        return;
      }
      const airport = await this.airportService.getAirportByCode(code);
      res.status(200).json(airport);
    } catch (error) {
      console.error('Error in AirportController: getAirportByCode:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  getAllAirportsOfCityByCityId = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ message: 'City ID is required' });
        return;
      }
      const airports = await this.airportService.getAllAirportsOfCityByCityId(id);
      res.status(200).json(airports);
    } catch (error) {
      console.error('Error in AirportController: getAllAirportsOfCityByCityId:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  getAllAirportsOfCityByCityName = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name } = req.params;
      if (!name) {
        res.status(400).json({ message: 'City name is required' });
        return;
      }
      const airports = await this.airportService.getAllAirportsOfCityByCityName(name);
      res.status(200).json(airports);
    } catch (error) {
      console.error('Error in AirportController: getAllAirportsOfCityByCityName:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  createAirport = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, code, city_id }: { name: string; code: string; city_id: string } = req.body;
      if (!name || !code || !city_id) {
        res.status(400).json({ message: 'Airport data is required' });
        return;
      }
      const newAirport = await this.airportService.createAirport({
        name,
        code,
        city_id,
      });
      res.status(201).json(newAirport);
    } catch (error) {
      console.error('Error in AirportController: createAirport:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  updateAirportName = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      if (!id || !name) {
        res.status(400).json({ message: 'Airport ID and name are required' });
        return;
      }
      const updatedAirport = await this.airportService.updateAirportName(id, name);
      res.status(200).json(updatedAirport);
    } catch (error) {
      console.error('Error in AirportController: updateAirportName:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  updateAirportCode = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { code } = req.body;
      if (!id || !code) {
        res.status(400).json({ message: 'Airport ID and code are required' });
        return;
      }
      const updatedAirport = await this.airportService.updateAirportCode(id, code);
      res.status(200).json(updatedAirport);
    } catch (error) {
      console.error('Error in AirportController: updateAirportCode:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  deleteAirport = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ message: 'Airport ID is required' });
        return;
      }
      await this.airportService.deleteAirport(id);
      res.status(204).send();
    } catch (error) {
      console.error('Error in AirportController: deleteAirport:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
}
