import { Request, Response } from 'express';

import { AirplaneService } from '../service/airplane.service';

export class AirplaneController {
  private airplaneService: AirplaneService;

  constructor() {
    this.airplaneService = new AirplaneService();
  }

  getAllAirplanes = async (_req: Request, res: Response): Promise<void> => {
    try {
      const airplanes = await this.airplaneService.getAllAirplanes();
      res.status(200).json(airplanes);
    } catch (error) {
      console.log('Error in AirplaneController: getAllAirplanes:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  getAirplaneById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ message: 'Airplane ID is required' });
        return;
      }
      const airplane = await this.airplaneService.getAirplaneById(id);
      res.status(200).json(airplane);
    } catch (error) {
      console.log('Error in AirplaneController: getAirplaneById:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  getAirplaneByCode = async (req: Request, res: Response): Promise<void> => {
    try {
      const { code } = req.params;
      if (!code) {
        res.status(400).json({ message: 'Airplane code is required' });
        return;
      }
      const airplane = await this.airplaneService.getAirplaneByCode(code);
      res.status(200).json(airplane);
    } catch (error) {
      console.log('Error in AirplaneController: getAirplaneByCode:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  getAirplaneByName = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name } = req.params;
      if (!name) {
        res.status(400).json({ message: 'Airplane name is required' });
        return;
      }
      const airplane = await this.airplaneService.getAirplaneByName(name);
      res.status(200).json(airplane);
    } catch (error) {
      console.log('Error in AirplaneController: getAirplaneByName:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  createAirplane = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, code, capacity }: { name: string; code: string; capacity: number } = req.body;
      if (!name || !code || !capacity) {
        res.status(400).json({ message: 'Airplane data is required' });
        return;
      }
      const newAirplane = await this.airplaneService.createAirplane({ name, code, capacity });
      res.status(201).json(newAirplane);
    } catch (error) {
      console.log('Error in AirplaneController: createAirplane:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  updateAirplaneName = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      if (!id || !name) {
        res.status(400).json({ message: 'Airplane ID and name are required' });
        return;
      }
      const updatedAirplane = await this.airplaneService.updateAirplaneName(id, name);
      res.status(200).json(updatedAirplane);
    } catch (error) {
      console.log('Error in AirplaneController: updateAirplaneName:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  updateAirplaneCode = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { code } = req.body;
      if (!id || !code) {
        res.status(400).json({ message: 'Airplane ID and code are required' });
        return;
      }
      const updatedAirplane = await this.airplaneService.updateAirplaneCode(id, code);
      res.status(200).json(updatedAirplane);
    } catch (error) {
      console.log('Error in AirplaneController: updateAirplaneCode:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  updateAirplaneCapacity = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { capacity } = req.body;
      if (!id || !capacity) {
        res.status(400).json({ message: 'Airplane ID and capacity are required' });
        return;
      }
      const updatedAirplane = await this.airplaneService.updateAirplaneCapacity(id, capacity);
      res.status(200).json(updatedAirplane);
    } catch (error) {
      console.log('Error in AirplaneController: updateAirplaneCapacity:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  deleteAirplane = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ message: 'Airplane ID is required' });
        return;
      }
      await this.airplaneService.deleteAirplane(id);
      res.status(204).send();
    } catch (error) {
      console.log('Error in AirplaneController: deleteAirplane:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
}
