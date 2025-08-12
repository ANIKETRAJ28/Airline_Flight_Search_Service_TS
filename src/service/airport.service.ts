import { IAirport, IAirportRequest, IAirportWithCityAndCountry } from '../interface/airports.interface';
import { AirportRepository } from '../repository/airport.repositry';

export class AirportService {
  private airportRepository: AirportRepository;

  constructor() {
    this.airportRepository = new AirportRepository();
  }

  async createAirport(airport: IAirportRequest): Promise<IAirportWithCityAndCountry> {
    return await this.airportRepository.createAirport(airport);
  }

  async getAirports(): Promise<IAirport[]> {
    return await this.airportRepository.getAirports();
  }

  async getAllAirports(offset: number): Promise<IAirportWithCityAndCountry[]> {
    return await this.airportRepository.getAllAirports(offset);
  }

  async getAirportById(id: string): Promise<IAirportWithCityAndCountry> {
    return await this.airportRepository.getAirportById(id);
  }

  async searchAirports(keyword: string, offset: number): Promise<IAirportWithCityAndCountry[]> {
    return await this.airportRepository.searchAirports(keyword, offset);
  }

  async getAirportByCode(code: string): Promise<IAirportWithCityAndCountry> {
    return await this.airportRepository.getAirportByCode(code);
  }

  async getAllAirportsOfCityByCityId(cityId: string, offset: number): Promise<IAirportWithCityAndCountry[]> {
    return await this.airportRepository.getAllAirportsOfCityByCityId(cityId, offset);
  }

  async getAllAirportsOfCityByCityName(cityName: string): Promise<IAirportWithCityAndCountry[]> {
    return await this.airportRepository.getAllAirportsOfCityByCityName(cityName);
  }

  async getAirportsForCountry(countryId: string, offset: number): Promise<IAirportWithCityAndCountry[]> {
    return await this.airportRepository.getAirportsForCountry(countryId, offset);
  }

  async updateAirport(id: string, name: string, code: string): Promise<IAirportWithCityAndCountry> {
    return await this.airportRepository.updateAirport(id, name, code);
  }

  async deleteAirport(id: string): Promise<void> {
    return await this.airportRepository.deleteAirport(id);
  }
}
