import { Request, Response } from 'express';
import { FlightService } from '../service/flight.service';
import { IFlightRequest } from '../interface/flights.interface';
import { IFlightStatus } from '../types/flightStatus.types';

export class FlightController {
  private flightService: FlightService;

  constructor() {
    this.flightService = new FlightService();
  }

  createFlight = async (req: Request, res: Response): Promise<void> => {
    try {
      const flightPayload: IFlightRequest = req.body;
      if (!flightPayload) {
        res.status(400).json({ message: 'Invalid flight data.' });
        return;
      }
      const flight = await this.flightService.createFlight(flightPayload);
      res.status(201).json(flight);
    } catch (error) {
      console.error('Error in FlightController: createFlight:', error);
      res.status(500).json({ message: 'Failed to create flight.' });
    }
  };

  getAllFlights = async (_req: Request, res: Response): Promise<void> => {
    try {
      const flights = await this.flightService.getAllFlights();
      res.status(200).json(flights);
    } catch (error) {
      console.error('Error in FlightController: getAllFlights:', error);
      res.status(500).json({ message: 'Failed to fetch flights.' });
    }
  };

  getFlightById = async (req: Request, res: Response): Promise<void> => {
    try {
      const flightId = req.params.id;
      if (!flightId) {
        res.status(400).json({ message: 'Invalid flight ID.' });
        return;
      }
      const flight = await this.flightService.getFlightById(flightId);
      res.status(200).json(flight);
    } catch (error) {
      console.error('Error in FlightController: getFlightById:', error);
      res.status(500).json({ message: 'Failed to fetch flight.' });
    }
  };

  getFlightWithDetailById = async (req: Request, res: Response): Promise<void> => {
    try {
      const flightId = req.params.id;
      if (!flightId) {
        res.status(400).json({ message: 'Invalid flight ID.' });
        return;
      }
      const flight = await this.flightService.getFlightWithDetailById(flightId);
      res.status(200).json(flight);
    } catch (error) {
      console.error('Error in FlightController: getFlightWithDetailByFlightId:', error);
      res.status(500).json({ message: 'Failed to fetch flight details.' });
    }
  };
  getFlightByFlightNumber = async (req: Request, res: Response): Promise<void> => {
    try {
      const flightNumber = req.params.flight_number;
      if (!flightNumber) {
        res.status(400).json({ message: 'Invalid flight number.' });
        return;
      }
      const flight = await this.flightService.getFlightByFlightNumber(flightNumber);
      res.status(200).json(flight);
    } catch (error) {
      console.error('Error in FlightController: getFlightByFlightNumber:', error);
      res.status(500).json({ message: 'Failed to fetch flight.' });
    }
  };

  updateFlightArrivalTime = async (req: Request, res: Response): Promise<void> => {
    try {
      const flightId = req.params.id;
      const arrivalTime = req.body.arrival_time;
      if (!flightId || !arrivalTime) {
        res.status(400).json({ message: 'Invalid flight ID or arrival time.' });
        return;
      }
      const flight = await this.flightService.updateFlightArrivalTime(flightId, arrivalTime);
      res.status(200).json(flight);
    } catch (error) {
      console.error('Error in FlightController: updateFlightArrivalTime:', error);
      res.status(500).json({ message: 'Failed to update flight arrival time.' });
    }
  };

  updateFlightDepartureTime = async (req: Request, res: Response): Promise<void> => {
    try {
      const flightId = req.params.id;
      const departureTime: Date = req.body.departure_time;
      if (!flightId || !departureTime) {
        res.status(400).json({ message: 'Invalid flight ID or departure time.' });
        return;
      }
      const flight = await this.flightService.updateFlightDepartureTime(flightId, departureTime);
      res.status(200).json(flight);
    } catch (error) {
      console.error('Error in FlightController: updateFlightDepartureTime:', error);
      res.status(500).json({ message: 'Failed to update flight departure time.' });
    }
  };

  updateFlightStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const flightId = req.params.id;
      const status: IFlightStatus = req.body.status;
      if (!flightId || !status) {
        res.status(400).json({ message: 'Invalid flight ID or status.' });
        return;
      }
      const flight = await this.flightService.updateFlightStatus(flightId, status);
      res.status(200).json(flight);
    } catch (error) {
      console.error('Error in FlightController: updateFlightStatus:', error);
      res.status(500).json({ message: 'Failed to update flight status.' });
    }
  };

  updateFlightPrice = async (req: Request, res: Response): Promise<void> => {
    try {
      const flightId = req.params.id;
      const price: number = req.body.price;
      if (!flightId || !price) {
        res.status(400).json({ message: 'Invalid flight ID or price.' });
        return;
      }
      const flight = await this.flightService.updateFlightPrice(flightId, price);
      res.status(200).json(flight);
    } catch (error) {
      console.error('Error in FlightController: updateFlightPrice:', error);
      res.status(500).json({ message: 'Failed to update flight price.' });
    }
  };

  updateFlightDepartureAirport = async (req: Request, res: Response): Promise<void> => {
    try {
      const flightId = req.params.id;
      const departureAirportId = req.body.departure_airport_id;
      if (!flightId || !departureAirportId) {
        res.status(400).json({ message: 'Invalid flight ID or departure airport ID.' });
        return;
      }
      const flight = await this.flightService.updateFlightDepartureAirport(flightId, departureAirportId);
      res.status(200).json(flight);
    } catch (error) {
      console.error('Error in FlightController: updateFlightDepartureAirport:', error);
      res.status(500).json({ message: 'Failed to update flight departure airport.' });
    }
  };

  updateFlightArrivalAirport = async (req: Request, res: Response): Promise<void> => {
    try {
      const flightId = req.params.id;
      const arrivalAirportId = req.body.arrival_airport_id;
      if (!flightId || !arrivalAirportId) {
        res.status(400).json({ message: 'Invalid flight ID or arrival airport ID.' });
        return;
      }
      const flight = await this.flightService.updateFlightArrivalAirport(flightId, arrivalAirportId);
      res.status(200).json(flight);
    } catch (error) {
      console.error('Error in FlightController: updateFlightArrivalAirport:', error);
      res.status(500).json({ message: 'Failed to update flight arrival airport.' });
    }
  };

  updateFlightAirplane = async (req: Request, res: Response): Promise<void> => {
    try {
      const flightId = req.params.id;
      const airplaneId = req.body.airplane_id;
      if (!flightId || !airplaneId) {
        res.status(400).json({ message: 'Invalid flight ID or airplane ID.' });
        return;
      }
      const flight = await this.flightService.updateFlightAirplane(flightId, airplaneId);
      res.status(200).json(flight);
    } catch (error) {
      console.error('Error in FlightController: updateFlightAirplane:', error);
      res.status(500).json({ message: 'Failed to update flight airplane.' });
    }
  };

  deleteFlight = async (req: Request, res: Response): Promise<void> => {
    try {
      const flightId = req.params.id;
      if (!flightId) {
        res.status(400).json({ message: 'Invalid flight ID.' });
        return;
      }
      await this.flightService.deleteFlight(flightId);
      res.status(204).send();
    } catch (error) {
      console.error('Error in FlightController: deleteFlight:', error);
      res.status(500).json({ message: 'Failed to delete flight.' });
    }
  };
}
