import { IAirportRequest, IAirportWithCityAndCountry } from '../interface/airports.interface';
import { AirportRepository } from '../repository/airport.repositry';

export class AirportService {
  private airportRepository: AirportRepository;

  constructor() {
    this.airportRepository = new AirportRepository();
  }

  async createAirport(airport: IAirportRequest): Promise<IAirportWithCityAndCountry> {
    return await this.airportRepository.createAirport(airport);
  }

  async getAllAirports(): Promise<IAirportWithCityAndCountry[]> {
    return await this.airportRepository.getAllAirports();
  }

  async getAirportById(id: string): Promise<IAirportWithCityAndCountry> {
    return await this.airportRepository.getAirportById(id);
  }

  async getAirportByCode(code: string): Promise<IAirportWithCityAndCountry> {
    return await this.airportRepository.getAirportByCode(code);
  }

  async getAllAirportsOfCityByCityId(cityId: string): Promise<IAirportWithCityAndCountry[]> {
    return await this.airportRepository.getAllAirportsOfCityByCityId(cityId);
  }

  async getAllAirportsOfCityByCityName(cityName: string): Promise<IAirportWithCityAndCountry[]> {
    return await this.airportRepository.getAllAirportsOfCityByCityName(cityName);
  }

  async updateAirportName(id: string, name: string): Promise<IAirportWithCityAndCountry> {
    return await this.airportRepository.updateAirportName(id, name);
  }

  async updateAirportCode(id: string, code: string): Promise<IAirportWithCityAndCountry> {
    return await this.airportRepository.updateAirportCode(id, code);
  }

  async deleteAirport(id: string): Promise<void> {
    return await this.airportRepository.deleteAirport(id);
  }
}
