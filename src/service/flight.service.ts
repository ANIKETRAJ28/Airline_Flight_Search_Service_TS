import { IFlightRequest, IFlightWithDetails, IFlightWithDetailsForUser } from '../interface/flights.interface';
import { FlightRepository } from '../repository/flight.repository';
import { IFlightStatus, IFlightWindow } from '../types/flight.types';

export class FlightService {
  private flightRepository: FlightRepository;

  constructor() {
    this.flightRepository = new FlightRepository();
  }

  async createFlight(data: IFlightRequest): Promise<IFlightWithDetails> {
    try {
      return await this.flightRepository.createFlight(data);
    } catch (error) {
      console.error('Error in FlightService: createFlight:', error);
      throw new Error('Failed to create flight. Please try again later.');
    }
  }

  async getAllFlights(): Promise<IFlightWithDetails[]> {
    try {
      return await this.flightRepository.getAllFlights();
    } catch (error) {
      console.error('Error in FlightService: getAllFlights:', error);
      throw new Error('Failed to fetch flights. Please try again later.');
    }
  }

  async getFlightByIdForAdmin(id: string): Promise<IFlightWithDetails> {
    try {
      return await this.flightRepository.getFlightByIdForAdmin(id);
    } catch (error) {
      console.error('Error in FlightService: getFlightByIdForAdmin:', error);
      throw new Error(`Failed to fetch flight with id ${id}. Please try again later.`);
    }
  }

  async getFlightByIdForUser(id: string): Promise<IFlightWithDetailsForUser> {
    try {
      return await this.flightRepository.getFlightByIdForUser(id);
    } catch (error) {
      console.error('Error in FlightService: getFlightByIdForUser:', error);
      throw new Error(`Failed to fetch flight with id ${id}. Please try again later.`);
    }
  }

  async getFlightByFlightNumber(flight_number: string): Promise<IFlightWithDetails> {
    try {
      return await this.flightRepository.getFlightByFlightNumber(flight_number);
    } catch (error) {
      console.error('Error in FlightService: getFlightByFlightNumber:', error);
      throw new Error(`Failed to fetch flight with number ${flight_number}. Please try again later.`);
    }
  }

  async getFlightsForArrivalAndDepartureCity(
    departure_city_id: string,
    arrival_city_id: string,
    date: Date,
  ): Promise<IFlightWithDetailsForUser[][]> {
    try {
      return await this.flightRepository.getFlightsForArrivalAndDepartureCity(departure_city_id, arrival_city_id, date);
    } catch (error) {
      console.error('Error in FlightService: getFlightsForArrivalAndDepartureCity:', error);
      throw new Error(
        `Failed to fetch flights for departure city ${departure_city_id} and arrival city ${arrival_city_id}. Please try again later.`,
      );
    }
  }

  async updateFlightArrivalTime(id: string, arrival_time: Date): Promise<IFlightWithDetails> {
    try {
      return await this.flightRepository.updateFlightArrivalTime(id, arrival_time);
    } catch (error) {
      console.error('Error in FlightService: updateFlightArrivalTime:', error);
      throw new Error(`Failed to update flight arrival time for id ${id}. Please try again later.`);
    }
  }

  async updateFlightWindowSeats(flight_id: string, window_type: IFlightWindow, seats: number): Promise<void> {
    try {
      await this.flightRepository.updateFlightWindowSeats(flight_id, window_type, seats);
    } catch (error) {
      console.error('Error in FlightService: updateFlightWindowSeats:', error);
      throw new Error(`Failed to update flight window seats for flight id ${flight_id}. Please try again later.`);
    }
  }

  async updateFlightDepartureTime(id: string, departure_time: Date): Promise<IFlightWithDetails> {
    try {
      return await this.flightRepository.updateFlightDepartureTime(id, departure_time);
    } catch (error) {
      console.error('Error in FlightService: updateFlightDepartureTime:', error);
      throw new Error(`Failed to update flight departure time for id ${id}. Please try again later.`);
    }
  }

  async updateFlightStatus(id: string, status: IFlightStatus): Promise<IFlightWithDetails> {
    try {
      return await this.flightRepository.updateFlightStatus(id, status);
    } catch (error) {
      console.error('Error in FlightService: updateFlightStatus:', error);
      throw new Error(`Failed to update flight status for id ${id}. Please try again later.`);
    }
  }

  async updateFlightPrice(id: string, price: number): Promise<IFlightWithDetails> {
    try {
      return await this.flightRepository.updateFlightPrice(id, price);
    } catch (error) {
      console.error('Error in FlightService: updateFlightPrice:', error);
      throw new Error(`Failed to update flight price for id ${id}. Please try again later.`);
    }
  }

  async updateFlightDepartureAirport(id: string, departure_airport_id: string): Promise<IFlightWithDetails> {
    try {
      return await this.flightRepository.updateFlightDepartureAirport(id, departure_airport_id);
    } catch (error) {
      console.error('Error in FlightService: updateFlightDepartureAirport:', error);
      throw new Error(`Failed to update flight departure airport for id ${id}. Please try again later.`);
    }
  }

  async updateFlightArrivalAirport(id: string, arrival_airport_id: string): Promise<IFlightWithDetails> {
    try {
      return await this.flightRepository.updateFlightArrivalAirport(id, arrival_airport_id);
    } catch (error) {
      console.error('Error in FlightService: updateFlightArrivalAirport:', error);
      throw new Error(`Failed to update flight arrival airport for id ${id}. Please try again later.`);
    }
  }

  async updateFlightAirplane(id: string, airplane_id: string): Promise<IFlightWithDetails> {
    try {
      return await this.flightRepository.updateFlightAirplane(id, airplane_id);
    } catch (error) {
      console.error('Error in FlightService: updateFlightAirplane:', error);
      throw new Error(`Failed to update flight airplane for id ${id}. Please try again later.`);
    }
  }

  async deleteFlight(id: string): Promise<void> {
    try {
      return await this.flightRepository.deleteFlight(id);
    } catch (error) {
      console.error('Error in FlightService: deleteFlight:', error);
      throw new Error(`Failed to delete flight with id ${id}. Please try again later.`);
    }
  }
}
