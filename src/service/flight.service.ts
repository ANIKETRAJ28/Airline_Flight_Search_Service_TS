import { IFlightRequest, IFlightWithDetails, IFlightWithDetailsForUser } from '../interface/flights.interface';
import { FlightRepository } from '../repository/flight.repository';
import { IFlightStatus, IFlightWindow } from '../types/flight.types';

export class FlightService {
  private flightRepository: FlightRepository;

  constructor() {
    this.flightRepository = new FlightRepository();
  }

  async createFlight(data: IFlightRequest): Promise<IFlightWithDetails> {
    return await this.flightRepository.createFlight(data);
  }

  async getAllFlights(): Promise<IFlightWithDetails[]> {
    return await this.flightRepository.getAllFlights();
  }

  async getFlightByIdForAdmin(id: string): Promise<IFlightWithDetails> {
    return await this.flightRepository.getFlightByIdForAdmin(id);
  }

  async getFlightByIdForUser(id: string): Promise<IFlightWithDetailsForUser> {
    return await this.flightRepository.getFlightByIdForUser(id);
  }

  async getFlightByFlightNumber(flight_number: string): Promise<IFlightWithDetails> {
    return await this.flightRepository.getFlightByFlightNumber(flight_number);
  }

  async getFlightsForArrivalAndDepartureCity(
    departure_city_id: string,
    arrival_city_id: string,
    date: Date,
  ): Promise<IFlightWithDetailsForUser[][]> {
    return await this.flightRepository.getFlightsForArrivalAndDepartureCity(departure_city_id, arrival_city_id, date);
  }

  async updateFlightArrivalTime(id: string, arrival_time: Date): Promise<IFlightWithDetails> {
    return await this.flightRepository.updateFlightArrivalTime(id, arrival_time);
  }

  async updateFlightWindowSeats(flight_id: string, window_type: IFlightWindow, seats: number): Promise<void> {
    await this.flightRepository.updateFlightWindowSeats(flight_id, window_type, seats);
  }

  async updateFlightDepartureTime(id: string, departure_time: Date): Promise<IFlightWithDetails> {
    return await this.flightRepository.updateFlightDepartureTime(id, departure_time);
  }

  async updateFlightStatus(id: string, status: IFlightStatus): Promise<IFlightWithDetails> {
    return await this.flightRepository.updateFlightStatus(id, status);
  }

  async updateFlightPrice(id: string, price: number): Promise<IFlightWithDetails> {
    return await this.flightRepository.updateFlightPrice(id, price);
  }

  async updateFlightDepartureAirport(id: string, departure_airport_id: string): Promise<IFlightWithDetails> {
    return await this.flightRepository.updateFlightDepartureAirport(id, departure_airport_id);
  }

  async updateFlightArrivalAirport(id: string, arrival_airport_id: string): Promise<IFlightWithDetails> {
    return await this.flightRepository.updateFlightArrivalAirport(id, arrival_airport_id);
  }

  async updateFlightAirplane(id: string, airplane_id: string): Promise<IFlightWithDetails> {
    return await this.flightRepository.updateFlightAirplane(id, airplane_id);
  }

  async deleteFlight(id: string): Promise<void> {
    return await this.flightRepository.deleteFlight(id);
  }
}
