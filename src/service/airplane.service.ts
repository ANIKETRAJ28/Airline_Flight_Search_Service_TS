import { IAirplane, IAirplaneRequest } from '../interface/airplanes.interface';
import { AirplaneRepository } from '../repository/airplane.repository';

export class AirplaneService {
  private airplaneRepository: AirplaneRepository;

  constructor() {
    this.airplaneRepository = new AirplaneRepository();
  }

  async getAllAirplanes(): Promise<IAirplane[]> {
    return await this.airplaneRepository.getAllAirplanes();
  }

  async getAirplaneById(id: string): Promise<IAirplane> {
    return await this.airplaneRepository.getAirplaneById(id);
  }

  async getAirplaneByCode(code: string): Promise<IAirplane> {
    return await this.airplaneRepository.getAirplaneByCode(code);
  }

  async getAirplaneByName(name: string): Promise<IAirplane> {
    return await this.airplaneRepository.getAirplaneByName(name);
  }

  async createAirplane(airplane: IAirplaneRequest): Promise<IAirplane> {
    return await this.airplaneRepository.createAirplane(airplane);
  }

  async updateAirplaneName(id: string, name: string): Promise<IAirplane> {
    return await this.airplaneRepository.updateAirplaneName(id, name);
  }

  async updateAirplaneCode(id: string, code: string): Promise<IAirplane> {
    return await this.airplaneRepository.updateAirplaneCode(id, code);
  }

  async updateAirplaneCapacity(id: string, capacity: number): Promise<IAirplane> {
    return await this.airplaneRepository.updateAirplaneCapacity(id, capacity);
  }

  async deleteAirplane(id: string): Promise<void> {
    return await this.airplaneRepository.deleteAirplane(id);
  }
}
