import { IFlightAutomation, IFlightAutomationRequest } from '../interface/flight_automation.interface';
import { FlightAutomationRepository } from '../repository/flight_automation.repository';

export class FlightAutomationService {
  private flightAutomationRepository: FlightAutomationRepository;

  constructor() {
    this.flightAutomationRepository = new FlightAutomationRepository();
  }

  async createFlightAutomation(flightAutomation: IFlightAutomationRequest): Promise<IFlightAutomation> {
    return this.flightAutomationRepository.createFlightAutomation(flightAutomation);
  }

  async getAllFlightAutomations(): Promise<IFlightAutomation[]> {
    return this.flightAutomationRepository.getActiveFlightAutomations();
  }

  async getActiveFlightAutomations(): Promise<IFlightAutomation[]> {
    return this.flightAutomationRepository.getActiveFlightAutomations();
  }

  async createFlightsFromAutomation(): Promise<void> {
    return this.flightAutomationRepository.createFlightsFromAutomation();
  }
}
