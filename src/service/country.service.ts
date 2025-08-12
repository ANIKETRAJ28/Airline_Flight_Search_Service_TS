import { ICountry, ICountryRequest } from '../interface/countries.interface';
import { CountryRepository } from '../repository/country.repository';

export class CountryService {
  private countryRepository: CountryRepository;

  constructor() {
    this.countryRepository = new CountryRepository();
  }

  async getCountries(): Promise<ICountry[]> {
    return await this.countryRepository.getCountries();
  }

  async getAllCountries(offset: number): Promise<ICountry[]> {
    return await this.countryRepository.getAllCountries(offset);
  }

  async getCountryById(id: string): Promise<ICountry> {
    return await this.countryRepository.getCountryById(id);
  }

  async searchCountry(keyword: string, offset: number): Promise<ICountry[]> {
    return await this.countryRepository.searchCountry(keyword, offset);
  }

  async getCountryByName(name: string): Promise<ICountry> {
    return await this.countryRepository.getCountryByName(name);
  }

  async getCountryByCode(code: string): Promise<ICountry> {
    return await this.countryRepository.getCountryByCode(code);
  }

  async createCountry(country: ICountryRequest): Promise<ICountry> {
    return await this.countryRepository.createCountry(country);
  }

  async updateCountry(id: string, data: ICountry): Promise<ICountry> {
    return await this.countryRepository.updateCountry(id, data);
  }

  async deleteCountry(id: string): Promise<void> {
    await this.countryRepository.deleteCountry(id);
  }
}
