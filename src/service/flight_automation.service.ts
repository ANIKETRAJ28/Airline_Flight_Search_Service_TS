import {
  IFlightAutomation,
  IFlightAutomationRequest,
  IFlightAutomationResponse,
} from '../interface/flight_automation.interface';
import { FlightAutomationRepository } from '../repository/flight_automation.repository';

export class FlightAutomationService {
  private flightAutomationRepository: FlightAutomationRepository;

  constructor() {
    this.flightAutomationRepository = new FlightAutomationRepository();
  }

  async createFlightAutomation(flightAutomation: IFlightAutomationRequest): Promise<IFlightAutomation> {
    return this.flightAutomationRepository.createFlightAutomation(flightAutomation);
  }

  async getAllFlightAutomations(offset: number): Promise<IFlightAutomationResponse[]> {
    return this.flightAutomationRepository.getAllFlightAutomations(offset);
  }

  async getActiveFlightAutomations(): Promise<IFlightAutomation[]> {
    return this.flightAutomationRepository.getActiveFlightAutomations();
  }

  async getFlightAutomationById(id: string): Promise<IFlightAutomation> {
    return this.flightAutomationRepository.getFlightAutomationById(id);
  }

  async getFlightAutomationsByDate(date: Date, offset: number): Promise<IFlightAutomationResponse[]> {
    return this.flightAutomationRepository.getFlightAutomationsByDate(date, offset);
  }

  async getFlightAutomationsByCancelledStatus(
    isCancelled: boolean,
    offset: number,
  ): Promise<IFlightAutomationResponse[]> {
    return this.flightAutomationRepository.getFlightAutomationsByCancelledStatus(isCancelled, offset);
  }

  async createFlightsFromAutomation(): Promise<void> {
    return this.flightAutomationRepository.createFlightsFromAutomation();
  }

  async updateFlightAutomationById(id: string): Promise<IFlightAutomationResponse> {
    return this.flightAutomationRepository.updateFlightAutomationById(id);
  }
}
