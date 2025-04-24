import { IAirplane, IAirplaneRequest } from '../interface/airplanes.interface';
import { AirplaneRepository } from '../repository/airplane.repository';

export class AirplaneService {
  private airplaneRepository: AirplaneRepository;

  constructor() {
    this.airplaneRepository = new AirplaneRepository();
  }

  async getAllAirplanes(): Promise<IAirplane[]> {
    try {
      return await this.airplaneRepository.getAllAirplanes();
    } catch (error) {
      console.log('Error in AirplaneService: getAllAirplanes:', error);
      throw error;
    }
  }

  async getAirplaneById(id: string): Promise<IAirplane> {
    try {
      return await this.airplaneRepository.getAirplaneById(id);
    } catch (error) {
      console.log('Error in AirplaneService: getAirplaneById:', error);
      throw error;
    }
  }

  async getAirplaneByCode(code: string): Promise<IAirplane> {
    try {
      return await this.airplaneRepository.getAirplaneByCode(code);
    } catch (error) {
      console.log('Error in AirplaneService: getAirplaneByCode:', error);
      throw error;
    }
  }

  async getAirplaneByName(name: string): Promise<IAirplane> {
    try {
      return await this.airplaneRepository.getAirplaneByName(name);
    } catch (error) {
      console.log('Error in AirplaneService: getAirplaneByName:', error);
      throw error;
    }
  }

  async createAirplane(airplane: IAirplaneRequest): Promise<IAirplane> {
    try {
      return await this.airplaneRepository.createAirplane(airplane);
    } catch (error) {
      console.log('Error in AirplaneService: createAirplane:', error);
      throw error;
    }
  }

  async updateAirplaneName(id: string, name: string): Promise<IAirplane> {
    try {
      return await this.airplaneRepository.updateAirplaneName(id, name);
    } catch (error) {
      console.log('Error in AirplaneService: updateAirplaneName:', error);
      throw error;
    }
  }

  async updateAirplaneCode(id: string, code: string): Promise<IAirplane> {
    try {
      return await this.airplaneRepository.updateAirplaneCode(id, code);
    } catch (error) {
      console.log('Error in AirplaneService: updateAirplaneCode:', error);
      throw error;
    }
  }

  async updateAirplaneCapacity(id: string, capacity: number): Promise<IAirplane> {
    try {
      return await this.airplaneRepository.updateAirplaneCapacity(id, capacity);
    } catch (error) {
      console.log('Error in AirplaneService: updateAirplaneCapacity:', error);
      throw error;
    }
  }

  async deleteAirplane(id: string): Promise<void> {
    try {
      return await this.airplaneRepository.deleteAirplane(id);
    } catch (error) {
      console.log('Error in AirplaneService: deleteAirplane:', error);
      throw error;
    }
  }
}
