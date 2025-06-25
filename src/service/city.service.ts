import { ICityRequest, ICityWithCountry } from '../interface/cities.interface';
import { CityRepository } from '../repository/city.repository';

export class CityService {
  private cityRepository: CityRepository;

  constructor() {
    this.cityRepository = new CityRepository();
  }

  async getAllCities(): Promise<ICityWithCountry[]> {
    return await this.cityRepository.getAllCities();
  }

  async getCityById(id: string): Promise<ICityWithCountry> {
    return await this.cityRepository.getCityById(id);
  }

  async getCityByName(name: string): Promise<ICityWithCountry> {
    return await this.cityRepository.getCityByName(name);
  }

  async createCity(city: ICityRequest): Promise<ICityWithCountry> {
    return await this.cityRepository.createCity(city);
  }

  async updateCityName(id: string, name: string): Promise<ICityWithCountry> {
    return await this.cityRepository.updateCityName(id, name);
  }

  async deleteCity(id: string): Promise<void> {
    return await this.cityRepository.deleteCity(id);
  }
}
