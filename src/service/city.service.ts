import { ICity, ICityRequest, ICityWithCountry } from '../interface/cities.interface';
import { CityRepository } from '../repository/city.repository';

export class CityService {
  private cityRepository: CityRepository;

  constructor() {
    this.cityRepository = new CityRepository();
  }

  async getCities(): Promise<ICity[]> {
    return await this.cityRepository.getCities();
  }

  async getAllCities(offset: number): Promise<ICityWithCountry[]> {
    return await this.cityRepository.getAllCities(offset);
  }

  async getCityById(id: string): Promise<ICityWithCountry> {
    return await this.cityRepository.getCityById(id);
  }

  async getCitiesByName(name: string): Promise<ICityWithCountry[]> {
    return await this.cityRepository.getCitiesByName(name);
  }

  async getCitiesForCountry(countryId: string, offset: number): Promise<ICityWithCountry[]> {
    return await this.cityRepository.getCitiesForCountry(countryId, offset);
  }

  async searchCities(keyword: string, offset: number): Promise<ICityWithCountry[]> {
    return await this.cityRepository.searchCities(keyword, offset);
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
