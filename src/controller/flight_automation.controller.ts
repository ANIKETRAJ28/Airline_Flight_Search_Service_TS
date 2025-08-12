import { Request, Response } from 'express';
import { FlightAutomationService } from '../service/flight_automation.service';
import { IFlightAutomationRequest } from '../interface/flight_automation.interface';
import { ApiError } from '../util/api.util';
import { apiHandler, errorHandler } from '../util/apiHandler.util';

export class FlightAutomationController {
  private flightAutomationService: FlightAutomationService;

  constructor() {
    this.flightAutomationService = new FlightAutomationService();
  }

  createFlightAutomation = async (req: Request, res: Response): Promise<void> => {
    try {
      const flightAutomationReq: IFlightAutomationRequest = req.body;
      if (flightAutomationReq.flight_rotation.length < 2) {
        throw new ApiError(400, 'Flight rotation must have at least 2 legs');
      }
      if (
        flightAutomationReq.flight_rotation[0].departure_airport_id !==
        flightAutomationReq.flight_rotation[flightAutomationReq.flight_rotation.length - 1].arrival_airport_id
      ) {
        throw new ApiError(400, 'First and last flight legs must have the same departure and arrival airports');
      }
      const flightAutomation: IFlightAutomationRequest = {
        ...flightAutomationReq,
        flight_rotation: flightAutomationReq.flight_rotation.map((flightLeg, i) => {
          if (i !== flightAutomationReq.flight_rotation.length - 1) {
            if (
              flightAutomationReq.flight_rotation[i].arrival_airport_id !==
              flightAutomationReq.flight_rotation[i + 1].departure_airport_id
            ) {
              throw new ApiError(
                400,
                `Flight leg ${i + 1} arrival airport does not match flight leg ${i + 2} departure airport`,
              );
            }
          }
          const { business, economy, premium } = flightLeg.class_window_price;
          if (
            economy.first_window_seats < 0 ||
            economy.second_window_seats < 0 ||
            economy.third_window_seats < 0 ||
            premium.first_window_seats < 0 ||
            premium.second_window_seats < 0 ||
            business.first_window_seats < 0 ||
            business.second_window_seats < 0
          ) {
            throw new ApiError(400, 'Number of seats cannot be negative');
          }
          if (
            economy.first_window_percentage < 1 ||
            economy.second_window_percentage < 1 ||
            economy.third_window_percentage < 1 ||
            premium.first_window_percentage < 1 ||
            premium.second_window_percentage < 1 ||
            business.first_window_percentage < 1 ||
            business.second_window_percentage < 1
          ) {
            throw new ApiError(400, 'Multiplicative factor of window seats cannot be less than 1');
          }
          return {
            ...flightLeg,
            class_window_price: {
              ...flightLeg.class_window_price,
              business: {
                ...flightLeg.class_window_price.business,
                total_seats:
                  flightLeg.class_window_price.business.first_window_seats +
                  flightLeg.class_window_price.business.second_window_seats,
              },
              premium: {
                ...flightLeg.class_window_price.premium,
                total_seats:
                  flightLeg.class_window_price.premium.first_window_seats +
                  flightLeg.class_window_price.premium.second_window_seats,
              },
              economy: {
                ...flightLeg.class_window_price.economy,
                total_seats:
                  flightLeg.class_window_price.economy.first_window_seats +
                  flightLeg.class_window_price.economy.second_window_seats +
                  flightLeg.class_window_price.economy.third_window_seats,
              },
            },
          };
        }),
      };
      const response = await this.flightAutomationService.createFlightAutomation(flightAutomation);
      apiHandler(res, 201, 'Flight Automation created successfully', response);
    } catch (error) {
      errorHandler(error, res);
    }
  };

  getAllFlightAutomations = async (req: Request, res: Response): Promise<void> => {
    try {
      const offset = parseInt(req.query.offset as string) || 0;
      const flightAutomations = await this.flightAutomationService.getAllFlightAutomations(offset);
      apiHandler(res, 200, 'All flight automations fetched successfully', flightAutomations);
    } catch (error) {
      errorHandler(error, res);
    }
  };

  getActiveFlightAutomations = async (_req: Request, res: Response): Promise<void> => {
    try {
      const flightAutomations = await this.flightAutomationService.getActiveFlightAutomations();
      apiHandler(res, 200, 'All active flight automations fetched successfully', flightAutomations);
    } catch (error) {
      errorHandler(error, res);
    }
  };

  getFlightAutomationById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      const flightAutomation = await this.flightAutomationService.getFlightAutomationById(id);
      if (!flightAutomation) {
        throw new ApiError(404, 'Flight automation not found');
      }
      apiHandler(res, 200, 'Flight automation fetched successfully', flightAutomation);
    } catch (error) {
      errorHandler(error, res);
    }
  };

  getFlightAutomationsByDate = async (req: Request, res: Response): Promise<void> => {
    try {
      const date = new Date(req.query.date as string);
      const offset = parseInt(req.query.offset as string) || 0;
      const flightAutomations = await this.flightAutomationService.getFlightAutomationsByDate(date, offset);
      apiHandler(res, 200, 'Flight automations by date fetched successfully', flightAutomations);
    } catch (error) {
      errorHandler(error, res);
    }
  };

  getFlightAutomationsByCancelledStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const isCancelled = req.query.is_cancelled === 'true';
      const offset = parseInt(req.query.offset as string) || 0;
      const flightAutomations = await this.flightAutomationService.getFlightAutomationsByCancelledStatus(
        isCancelled,
        offset,
      );
      apiHandler(res, 200, 'Flight automations by cancelled status fetched successfully', flightAutomations);
    } catch (error) {
      errorHandler(error, res);
    }
  };

  createFlightsFromAutomation = async (_req: Request, res: Response): Promise<void> => {
    try {
      await this.flightAutomationService.createFlightsFromAutomation();
      apiHandler(res, 200, 'Flights created from automation successfully');
    } catch (error) {
      errorHandler(error, res);
    }
  };

  updateFlightAutomationById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      const response = await this.flightAutomationService.updateFlightAutomationById(id);
      apiHandler(res, 200, 'Flight automation updated successfully', response);
    } catch (error) {
      errorHandler(error, res);
    }
  };
}
