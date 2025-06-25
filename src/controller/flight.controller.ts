import { Request, Response } from 'express';
import { FlightService } from '../service/flight.service';
import { IFlightRequest } from '../interface/flights.interface';
import { IFlightStatus, IFlightWindow } from '../types/flight.types';
import { ApiError } from '../util/api.util';
import { apiHandler, errorHandler } from '../util/apiHandler.util';

export class FlightController {
  private flightService: FlightService;

  constructor() {
    this.flightService = new FlightService();
  }

  createFlight = async (req: Request, res: Response): Promise<void> => {
    try {
      const flightPayload: IFlightRequest = req.body;
      if (!flightPayload) {
        throw new ApiError(400, 'Flight details are required');
      }
      const flight = await this.flightService.createFlight(flightPayload);
      apiHandler(res, 201, 'Flight created successfully', flight);
    } catch (error) {
      errorHandler(error, res);
    }
  };

  getAllFlights = async (_req: Request, res: Response): Promise<void> => {
    try {
      const flights = await this.flightService.getAllFlights();
      apiHandler(res, 200, 'All flights fetched successfully', flights);
    } catch (error) {
      errorHandler(error, res);
    }
  };

  getFlightByIdForAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
      const flightId = req.params.id;
      if (!flightId) {
        throw new ApiError(400, 'Flight ID is required');
      }
      const flight = await this.flightService.getFlightByIdForAdmin(flightId);
      apiHandler(res, 200, 'Flight fetched successfully', flight);
    } catch (error) {
      errorHandler(error, res);
    }
  };

  getFlighByIdForUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const flightId = req.params.id;
      if (!flightId) {
        throw new ApiError(400, 'Flight ID is required');
      }
      const flight = await this.flightService.getFlightByIdForUser(flightId);
      apiHandler(res, 200, 'Flight fetched successfully', flight);
    } catch (error) {
      errorHandler(error, res);
    }
  };

  getFlightByFlightNumber = async (req: Request, res: Response): Promise<void> => {
    try {
      const flightNumber = req.params.flight_number;
      if (!flightNumber) {
        throw new ApiError(400, 'Flight number is required');
      }
      const flight = await this.flightService.getFlightByFlightNumber(flightNumber);
      apiHandler(res, 200, 'Flight fetched successfully', flight);
    } catch (error) {
      errorHandler(error, res);
    }
  };

  getFlightsForArrivalAndDepartureCity = async (req: Request, res: Response): Promise<void> => {
    try {
      const departureCityId = req.params.departure_city_id as string;
      const arrivalCityId = req.params.arrival_city_id as string;
      const date = req.params.date as string;
      if (!departureCityId || !arrivalCityId || !date) {
        throw new ApiError(400, 'Departure city ID, arrival city ID, and date are required');
      }
      const flights = await this.flightService.getFlightsForArrivalAndDepartureCity(
        departureCityId,
        arrivalCityId,
        new Date(date),
      );
      apiHandler(res, 200, 'Flights for the specified cities fetched successfully', flights);
    } catch (error) {
      errorHandler(error, res);
    }
  };

  updateFlightArrivalTime = async (req: Request, res: Response): Promise<void> => {
    try {
      const flightId = req.params.id;
      const arrivalTime = req.body.arrival_time;
      if (!flightId || !arrivalTime) {
        throw new ApiError(400, 'Invalid flight ID or arrival time');
      }
      const flight = await this.flightService.updateFlightArrivalTime(flightId, arrivalTime);
      apiHandler(res, 200, 'Flight arrival time updated successfully', flight);
    } catch (error) {
      errorHandler(error, res);
    }
  };

  updateFlightDepartureTime = async (req: Request, res: Response): Promise<void> => {
    try {
      const flightId = req.params.id;
      const departureTime: Date = req.body.departure_time;
      if (!flightId || !departureTime) {
        throw new ApiError(400, 'Invalid flight ID or departure time');
      }
      const flight = await this.flightService.updateFlightDepartureTime(flightId, departureTime);
      apiHandler(res, 200, 'Flight departure time updated successfully', flight);
    } catch (error) {
      errorHandler(error, res);
    }
  };

  updateFlightStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const flightId = req.params.id;
      const status: IFlightStatus = req.body.status;
      if (!flightId || !status) {
        throw new ApiError(400, 'Invalid flight ID or status');
      }
      const flight = await this.flightService.updateFlightStatus(flightId, status);
      apiHandler(res, 200, 'Flight status updated successfully', flight);
    } catch (error) {
      errorHandler(error, res);
    }
  };

  updateFlightPrice = async (req: Request, res: Response): Promise<void> => {
    try {
      const flightId = req.params.id;
      const price: number = req.body.price;
      if (!flightId || !price) {
        throw new ApiError(400, 'Invalid flight ID or price');
      }
      const flight = await this.flightService.updateFlightPrice(flightId, price);
      apiHandler(res, 200, 'Flight price updated successfully', flight);
    } catch (error) {
      errorHandler(error, res);
    }
  };

  updateFlightDepartureAirport = async (req: Request, res: Response): Promise<void> => {
    try {
      const flightId = req.params.id;
      const departureAirportId = req.body.departure_airport_id;
      if (!flightId || !departureAirportId) {
        throw new ApiError(400, 'Invalid flight ID or departure airport ID');
      }
      const flight = await this.flightService.updateFlightDepartureAirport(flightId, departureAirportId);
      apiHandler(res, 200, 'Flight departure airport updated successfully', flight);
    } catch (error) {
      errorHandler(error, res);
    }
  };

  updateFlightArrivalAirport = async (req: Request, res: Response): Promise<void> => {
    try {
      const flightId = req.params.id;
      const arrivalAirportId = req.body.arrival_airport_id;
      if (!flightId || !arrivalAirportId) {
        throw new ApiError(400, 'Invalid flight ID or arrival airport ID');
      }
      const flight = await this.flightService.updateFlightArrivalAirport(flightId, arrivalAirportId);
      apiHandler(res, 200, 'Flight arrival airport updated successfully', flight);
    } catch (error) {
      errorHandler(error, res);
    }
  };

  updateFlightAirplane = async (req: Request, res: Response): Promise<void> => {
    try {
      const flightId = req.params.id;
      const airplaneId = req.body.airplane_id;
      if (!flightId || !airplaneId) {
        throw new ApiError(400, 'Invalid flight ID or airplane ID');
      }
      const flight = await this.flightService.updateFlightAirplane(flightId, airplaneId);
      apiHandler(res, 200, 'Flight airplane updated successfully', flight);
    } catch (error) {
      errorHandler(error, res);
    }
  };

  updateFlightWindowSeats = async (req: Request, res: Response): Promise<void> => {
    try {
      const flightId = req.params.id;
      const window_type: IFlightWindow = req.body.window_type;
      const windowSeats = req.body.seats;
      if (!flightId || !window_type || !windowSeats) {
        throw new ApiError(400, 'Invalid flight ID, window type, or number of seats');
      }
      if (typeof windowSeats !== 'number' || windowSeats < 0) {
        throw new ApiError(400, 'Invalid number of window seats. It must be a non-negative integer');
      }
      const flight = await this.flightService.updateFlightWindowSeats(flightId, window_type, windowSeats);
      apiHandler(res, 200, 'Flight window seats updated successfully', flight);
    } catch (error) {
      errorHandler(error, res);
    }
  };

  deleteFlight = async (req: Request, res: Response): Promise<void> => {
    try {
      const flightId = req.params.id;
      if (!flightId) {
        throw new ApiError(400, 'Flight ID is required');
      }
      await this.flightService.deleteFlight(flightId);
      apiHandler(res, 200, 'Flight deleted successfully');
    } catch (error) {
      errorHandler(error, res);
    }
  };
}
