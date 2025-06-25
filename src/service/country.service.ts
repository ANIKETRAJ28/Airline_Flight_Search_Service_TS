import { ICountry, ICountryRequest } from '../interface/countries.interface';
import { CountryRepository } from '../repository/country.repository';

export class CountryService {
  private countryRepository: CountryRepository;

  constructor() {
    this.countryRepository = new CountryRepository();
  }

  async getAllCountries(): Promise<ICountry[]> {
    return await this.countryRepository.getAllCountries();
  }

  async getCountryById(id: string): Promise<ICountry> {
    return await this.countryRepository.getCountryById(id);
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

  async updateCountryName(id: string, name: string): Promise<ICountry> {
    return await this.countryRepository.updateCountryName(id, name);
  }

  async updateCountryCode(id: string, code: string): Promise<ICountry> {
    return await this.countryRepository.updateCountryCode(id, code);
  }

  async deleteCountry(id: string): Promise<void> {
    await this.countryRepository.deleteCountry(id);
  }
}
