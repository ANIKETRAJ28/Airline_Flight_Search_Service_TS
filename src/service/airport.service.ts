import { IAirport, IAirportRequest, IAirportWithCityAndCountry } from '../interface/airports.interface';
import { AirportRepository } from '../repository/airport.repositry';

export class AirportService {
  private airportRepository: AirportRepository;

  constructor() {
    this.airportRepository = new AirportRepository();
  }

  async createAirport(airport: IAirportRequest): Promise<IAirport> {
    try {
      return await this.airportRepository.createAirport(airport);
    } catch (error) {
      console.log('Error in AirportService: createAirport:', error);
      throw error;
    }
  }

  async getAllAirports(): Promise<IAirport[]> {
    try {
      return await this.airportRepository.getAllAirports();
    } catch (error) {
      console.log('Error in AirportService: getAllAirports:', error);
      throw error;
    }
  }

  async getAirportById(id: string): Promise<IAirport> {
    try {
      return await this.airportRepository.getAirportById(id);
    } catch (error) {
      console.log('Error in AirportService: getAirportById:', error);
      throw error;
    }
  }

  async getAirportByCode(code: string): Promise<IAirport> {
    try {
      return await this.airportRepository.getAirportByCode(code);
    } catch (error) {
      console.log('Error in AirportService: getAirportByCode:', error);
      throw error;
    }
  }

  async getAllAirportsOfCityByCityId(cityId: string): Promise<IAirportWithCityAndCountry[]> {
    try {
      return await this.airportRepository.getAllAirportsOfCityByCityId(cityId);
    } catch (error) {
      console.log('Error in AirportService: getAllAirportsOfCityByCityId:', error);
      throw error;
    }
  }

  async getAllAirportsOfCityByCityName(cityName: string): Promise<IAirportWithCityAndCountry[]> {
    try {
      return await this.airportRepository.getAllAirportsOfCityByCityName(cityName);
    } catch (error) {
      console.log('Error in AirportService: getAllAirportsOfCityByCityName:', error);
      throw error;
    }
  }

  async updateAirportName(id: string, name: string): Promise<IAirport> {
    try {
      return await this.airportRepository.updateAirportName(id, name);
    } catch (error) {
      console.log('Error in AirportService: updateAirportName:', error);
      throw error;
    }
  }

  async updateAirportCode(id: string, code: string): Promise<IAirport> {
    try {
      return await this.airportRepository.updateAirportCode(id, code);
    } catch (error) {
      console.log('Error in AirportService: updateAirportCode:', error);
      throw error;
    }
  }

  async deleteAirport(id: string): Promise<void> {
    try {
      return await this.airportRepository.deleteAirport(id);
    } catch (error) {
      console.log('Error in AirportService: deleteAirport:', error);
      throw error;
    }
  }
}
