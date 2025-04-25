import { IFlightRequest, IFlightWithDetails } from '../interface/flights.interface';
import { FlightRepository } from '../repository/flight.repository';
import { IFlightStatus } from '../types/flightStatus.types';

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

  async getFlightById(id: string): Promise<IFlightWithDetails> {
    try {
      return await this.flightRepository.getFlightById(id);
    } catch (error) {
      console.error('Error in FlightService: getFlightById:', error);
      throw new Error(`Failed to fetch flight with id ${id}. Please try again later.`);
    }
  }

  async getFlightWithDetailById(id: string): Promise<IFlightWithDetails> {
    try {
      return this.flightRepository.getFlightWithDetailById(id);
    } catch (error) {
      console.error('Error in FlightService: getFlightWithDetailByFlightId:', error);
      throw new Error(`Failed to fetch flight details for id ${id}. Please try again later.`);
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

  async updateFlightArrivalTime(id: string, arrival_time: Date): Promise<IFlightWithDetails> {
    try {
      return await this.flightRepository.updateFlightArrivalTime(id, arrival_time);
    } catch (error) {
      console.error('Error in FlightService: updateFlightArrivalTime:', error);
      throw new Error(`Failed to update flight arrival time for id ${id}. Please try again later.`);
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
