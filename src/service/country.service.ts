import { ICountry, ICountryRequest } from '../interface/countries.interface';
import { CountryRepository } from '../repository/country.repository';

export class CountryService {
  private countryRepository: CountryRepository;

  constructor() {
    this.countryRepository = new CountryRepository();
  }

  async getAllCountries(): Promise<ICountry[]> {
    try {
      const countries: ICountry[] = await this.countryRepository.getAllCountries();
      return countries;
    } catch (error) {
      console.log('Error in CountryService: getAllCountries:', error);
      throw error;
    }
  }

  async getCountryById(id: string): Promise<ICountry> {
    try {
      const country: ICountry = await this.countryRepository.getCountryById(id);
      return country;
    } catch (error) {
      console.log('Error in CountryService: getCountryById:', error);
      throw error;
    }
  }

  async getCountryByName(name: string): Promise<ICountry> {
    try {
      const country: ICountry = await this.countryRepository.getCountryByName(name);
      return country;
    } catch (error) {
      console.log('Error in CountryService: getCountryByName:', error);
      throw error;
    }
  }

  async getCountryByCode(code: string): Promise<ICountry> {
    try {
      const country: ICountry = await this.countryRepository.getCountryByCode(code);
      return country;
    } catch (error) {
      console.log('Error in CountryService: getCountryByCode:', error);
      throw error;
    }
  }

  async createCountry(country: ICountryRequest): Promise<ICountry> {
    try {
      const newCountry: ICountry = await this.countryRepository.createCountry(country);
      return newCountry;
    } catch (error) {
      console.log('Error in CountryService: createCountry:', error);
      throw error;
    }
  }

  async updateCountryName(id: string, name: string): Promise<ICountry> {
    try {
      const updatedCountry: ICountry = await this.countryRepository.updateCountryName(id, name);
      return updatedCountry;
    } catch (error) {
      console.log('Error in CountryService: updateCountryName:', error);
      throw error;
    }
  }

  async updateCountryCode(id: string, code: string): Promise<ICountry> {
    try {
      const updatedCountry = await this.countryRepository.updateCountryCode(id, code);
      return updatedCountry;
    } catch (error) {
      console.log('Error in CountryService: updateCountryCode:', error);
      throw error;
    }
  }

  async deleteCountry(id: string): Promise<void> {
    try {
      await this.countryRepository.deleteCountry(id);
    } catch (error) {
      console.log('Error in CountryService: deleteCountry:', error);
      throw error;
    }
  }
}
