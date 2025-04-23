import { ICityRequest, ICityWithCountry } from '../interface/cities.interface';
import { CityRepository } from '../repository/city.repository';

export class CityService {
  private cityRepository: CityRepository;

  constructor() {
    this.cityRepository = new CityRepository();
  }

  async getAllCities(): Promise<ICityWithCountry[]> {
    try {
      return await this.cityRepository.getAllCities();
    } catch (error) {
      console.log('Error in CityService: getAllCities:', error);
      throw error;
    }
  }

  async getCityById(id: string): Promise<ICityWithCountry> {
    try {
      return await this.cityRepository.getCityById(id);
    } catch (error) {
      console.log('Error in CityService: getCityById:', error);
      throw error;
    }
  }

  async getCityByName(name: string): Promise<ICityWithCountry> {
    try {
      return await this.cityRepository.getCityByName(name);
    } catch (error) {
      console.log('Error in CityService: getCityByName:', error);
      throw error;
    }
  }

  async createCity(city: ICityRequest): Promise<ICityWithCountry> {
    try {
      return await this.cityRepository.createCity(city);
    } catch (error) {
      console.log('Error in CityService: createCity:', error);
      throw error;
    }
  }

  async updateCityName(id: string, name: string): Promise<ICityWithCountry> {
    try {
      return await this.cityRepository.updateCityName(id, name);
    } catch (error) {
      console.log('Error in CityService: updateCityName:', error);
      throw error;
    }
  }

  async deleteCity(id: string): Promise<void> {
    try {
      return await this.cityRepository.deleteCity(id);
    } catch (error) {
      console.log('Error in CityService: deleteCity:', error);
      throw error;
    }
  }
}
